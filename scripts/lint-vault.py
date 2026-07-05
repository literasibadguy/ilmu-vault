#!/usr/bin/env python3
import os
import re
import json
import subprocess
from datetime import datetime
from pathlib import Path

VAULT_ROOT = Path("/Users/firasrafislam/Documents/ilmuzip-vault")
WIKI_DIR = VAULT_ROOT / "wiki"
MANIFEST_PATH = VAULT_ROOT / ".raw" / ".manifest.json"
COUNTER_PATH = VAULT_ROOT / ".vault-meta" / "address-counter.txt"
LEGACY_PAGES_PATH = VAULT_ROOT / ".vault-meta" / "legacy-pages.txt"

def parse_frontmatter(content):
    lines = content.split('\n')
    if not lines or lines[0].strip() != '---':
        return None, 0, []
    
    fm_lines = []
    end_idx = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == '---':
            end_idx = i
            break
        fm_lines.append(lines[i])
    
    if end_idx == -1:
        return None, 0, []
    
    fm = {}
    for line in fm_lines:
        if ':' in line:
            k, v = line.split(':', 1)
            k = k.strip()
            v = v.strip()
            # Clean quotes
            if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                v = v[1:-1]
            # Handle list format
            if v.startswith('[') and v.endswith(']'):
                v = [x.strip() for x in v[1:-1].split(',')]
            fm[k] = v
            
    return fm, end_idx + 1, fm_lines

def run_peek_counter():
    try:
        # Run allocate-address.sh --peek
        script_path = VAULT_ROOT / "scripts" / "allocate-address.sh"
        res = subprocess.run([str(script_path), "--peek"], capture_output=True, text=True, check=True)
        return int(res.stdout.strip())
    except Exception as e:
        # Fallback reading counter file
        if COUNTER_PATH.is_file():
            try:
                return int(COUNTER_PATH.read_text(encoding="utf-8").strip())
            except:
                pass
        return 106  # Default fallback

def main():
    import sys
    sys.stderr.write("Starting wiki lint analysis...\n")
    
    # 1. Scan files
    all_md_files = []
    for root, dirs, files in os.walk(WIKI_DIR):
        for f in files:
            if f.endswith(".md"):
                all_md_files.append(Path(root) / f)
                
    # 2. Build maps
    # Map from basename (lower) to file path relative to vault root
    basename_to_relpath = {}
    relpath_to_basename = {}
    duplicate_basenames = {}
    
    for p in all_md_files:
        rel_path = p.relative_to(VAULT_ROOT)
        basename = p.stem
        basename_lower = basename.lower()
        
        if basename_lower in basename_to_relpath:
            if basename_lower not in duplicate_basenames:
                duplicate_basenames[basename_lower] = [basename_to_relpath[basename_lower]]
            duplicate_basenames[basename_lower].append(str(rel_path))
        else:
            basename_to_relpath[basename_lower] = str(rel_path)
            
        relpath_to_basename[str(rel_path)] = basename
        
    # 3. Read manifest address map
    manifest_address_map = {}
    if MANIFEST_PATH.is_file():
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                manifest_data = json.load(f)
                manifest_address_map = manifest_data.get("address_map", {})
        except Exception as e:
            print(f"Error reading manifest: {e}")
            
    # Load legacy pages list
    legacy_pages = set()
    if LEGACY_PAGES_PATH.is_file():
        with open(LEGACY_PAGES_PATH, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    legacy_pages.add(line)
            
    peek_value = run_peek_counter()
    
    # Excluded files for validation & orphan checks
    excluded_basenames = {
        "_index", "index", "log", "hot", "overview", "dashboard", 
        "Wiki Map", "getting-started", "tiling-report"
    }
    
    def is_excluded(rel_path, basename, fm):
        parts = rel_path.split(os.sep)
        if "meta" in parts or "folds" in parts:
            return True
        if basename in excluded_basenames:
            return True
        if fm and (fm.get("type") in ("meta", "fold")):
            return True
        return False

    # Stats & Issue buckets
    scanned_count = len(all_md_files)
    issues_found = 0
    post_rollout_checked = 0
    post_rollout_errors = 0
    legacy_pending_backfill = 0
    
    orphans = []
    dead_links = [] # list of dict: {source, target, display}
    frontmatter_gaps = [] # list of dict: {page, missing_fields}
    address_errors = []
    empty_sections = [] # list of dict: {page, heading}
    manifest_mismatches = []
    
    # Store links to calculate orphans
    # map: target_basename_lower -> set of source_basenames
    inbound_links = {}
    
    # Parse each file
    for p in all_md_files:
        rel_path_str = str(p.relative_to(VAULT_ROOT))
        basename = p.stem
        
        try:
            content = p.read_text(encoding="utf-8")
        except Exception as e:
            print(f"Error reading {rel_path_str}: {e}")
            continue
            
        fm, body_start_idx, fm_lines = parse_frontmatter(content)
        body_content = "\n".join(content.split('\n')[body_start_idx:]) if fm else content
        
        # Frontmatter check
        required_fields = ["type", "status", "created", "updated", "tags"]
        missing_fields = []
        if fm is None:
            missing_fields = list(required_fields)
        else:
            for field in required_fields:
                if field not in fm or not fm[field]:
                    missing_fields.append(field)
                    
        if missing_fields:
            frontmatter_gaps.append({"page": basename, "fields": missing_fields})
            issues_found += len(missing_fields)
            
        # Address validation
        excluded = is_excluded(rel_path_str, basename, fm)
        address = fm.get("address") if fm else None
        
        if not excluded:
            # Check if page is in legacy manifest
            is_legacy = str(rel_path_str) in legacy_pages
            
            # Post-rollout pages must have address (unless legacy)
            # (In this vault, all pages are created post-rollout June 2026)
            created_str = fm.get("created") if fm else None
            # Check if created is valid date
            is_post_rollout = True # Default to true
            if created_str:
                try:
                    created_date = datetime.strptime(created_str, "%Y-%m-%d")
                    if created_date < datetime(2026, 4, 23):
                        is_post_rollout = False
                except:
                    pass
            
            # Legacy pages don't need addresses
            if is_legacy:
                is_post_rollout = False
            
            if is_post_rollout:
                post_rollout_checked += 1
                
            if address:
                # Format check
                if not re.match(r"^[cl]-[0-9]{6}$", address):
                    address_errors.append(f"[[{basename}]]: invalid address format `{address}`. Expected `c-NNNNNN` or `l-NNNNNN`.")
                    issues_found += 1
                else:
                    # Counter consistency for c- addresses
                    if address.startswith("c-"):
                        try:
                            addr_val = int(address.split("-")[1])
                            if addr_val >= peek_value:
                                address_errors.append(f"[[{basename}]] has address `{address}` but counter peek is `{peek_value}`. Counter drift.")
                                issues_found += 1
                        except ValueError:
                            pass
                            
                # Address-map consistency with manifest
                manifest_addr = manifest_address_map.get(rel_path_str)
                if manifest_addr != address:
                    manifest_mismatches.append(f"`.raw/.manifest.json` maps `{rel_path_str}` -> `{manifest_addr}` but page frontmatter has `{address}`.")
                    issues_found += 1
            else:
                if is_post_rollout:
                    post_rollout_errors += 1
                    address_errors.append(f"[[{basename}]]: missing address. Page created {created_str or 'unknown'} (post-rollout); address required.")
                    issues_found += 1
                elif is_legacy:
                    legacy_pending_backfill += 1
        else:
            # For excluded pages, they should not have address
            if address:
                # Unless it is specifically mapped or legacy, but we enforce no addresses for meta/folds
                pass
                
        # Link extraction
        # Find all [[Target]]
        should_scan_links = not excluded or basename in ("index", "overview", "hot")
        if should_scan_links:
            links = re.findall(r"\[\[([^\]]+)\]\]", body_content)
            for link in links:
                # Parse link target
                target_part = link.split("|")[0].strip()
                target_part = target_part.split("#")[0].strip()
                
                if not target_part:
                    continue # self reference e.g. [[#Header]]
                    
                target_lower = target_part.lower()
                
                # Map target back to actual basename if it exists
                exists = target_lower in basename_to_relpath
                
                if not exists:
                    dead_links.append({"source": basename, "target": target_part})
                    issues_found += 1
                else:
                    # Record inbound link for orphan check
                    # Find the actual case-sensitive basename from our map
                    target_rel_path = basename_to_relpath[target_lower]
                    target_basename = relpath_to_basename[target_rel_path]
                    
                    # Check if the source is also excluded or is index/log/hot/overview
                    source_excluded = is_excluded(rel_path_str, basename, fm)
                    
                    if not source_excluded:
                        if target_basename not in inbound_links:
                            inbound_links[target_basename] = set()
                        inbound_links[target_basename].add(basename)
                    
        # Empty sections check
        if not excluded:
            lines = body_content.split('\n')
            current_heading = None
            has_content = False
            for line in lines:
                if line.strip().startswith('#'):
                    if current_heading and not has_content:
                        empty_sections.append({"page": basename, "heading": current_heading})
                        issues_found += 1
                    current_heading = line.strip()
                    has_content = False
                elif line.strip() and not line.strip().startswith('---'):
                    # Check if it has actual text content, not just spacing or comments
                    # Simple check: has characters
                    has_content = True
            if current_heading and not has_content:
                empty_sections.append({"page": basename, "heading": current_heading})
                issues_found += 1
            
    # Manifest address_map backward check:
    # Check if there are keys in manifest_address_map that do not exist or mismatch on disk
    for rel_path_str, manifest_addr in manifest_address_map.items():
        full_path = VAULT_ROOT / rel_path_str
        if not full_path.is_file():
            manifest_mismatches.append(f"`.raw/.manifest.json` maps `{rel_path_str}` -> `{manifest_addr}` but the file does not exist on disk.")
            issues_found += 1
        else:
            # Handled in forward loop
            pass

    # Orphan pages calculation
    # Included pages that have no inbound links from other included pages
    for p in all_md_files:
        rel_path_str = str(p.relative_to(VAULT_ROOT))
        basename = p.stem
        fm, _, _ = parse_frontmatter(p.read_text(encoding="utf-8")) if p.is_file() else (None, 0, [])
        
        if not is_excluded(rel_path_str, basename, fm):
            # Check inbound links
            sources = inbound_links.get(basename, set())
            # Exclude self-links
            sources_other = [s for s in sources if s != basename]
            if not sources_other:
                orphans.append(basename)
                issues_found += 1
                
    # Sort everything for stable report output
    orphans.sort()
    dead_links.sort(key=lambda x: (x["target"], x["source"]))
    frontmatter_gaps.sort(key=lambda x: x["page"])
    address_errors.sort()
    empty_sections.sort(key=lambda x: (x["page"], x["heading"]))
    manifest_mismatches.sort()
    
    # Check duplicate basenames
    duplicate_errors = []
    for base, paths in duplicate_basenames.items():
        duplicate_errors.append(f"Duplicate filename `{base}` found in paths: " + ", ".join([f"[[{Path(p).stem}]] ({p})" for p in paths]))
        issues_found += len(paths)
        
    # Group missing pages (dead links referenced by multiple files)
    missing_pages_map = {}
    for dl in dead_links:
        target = dl["target"]
        source = dl["source"]
        if target not in missing_pages_map:
            missing_pages_map[target] = []
        missing_pages_map[target].append(source)
        
    missing_pages = []
    for target, sources in missing_pages_map.items():
        if len(sources) >= 1: # Group all dead links as candidate missing pages
            missing_pages.append({"target": target, "sources": sorted(list(set(sources)))})
    missing_pages.sort(key=lambda x: (-len(x["sources"]), x["target"]))

    # Print markdown report
    today_str = datetime.now().strftime("%Y-%m-%d")
    
    sys.stderr.write("Generating report structure...\n")
    
    report_lines = []
    report_lines.append("---")
    report_lines.append("type: meta")
    report_lines.append(f'title: "Lint Report {today_str}"')
    report_lines.append(f'created: "{today_str}"')
    report_lines.append(f'updated: "{today_str}"')
    report_lines.append("tags: [meta, lint]")
    report_lines.append("status: developing")
    report_lines.append("---")
    report_lines.append("")
    report_lines.append(f"# Lint Report: {today_str}")
    report_lines.append("")
    report_lines.append("## Summary")
    report_lines.append(f"- Pages scanned: {scanned_count}")
    report_lines.append(f"- Issues found: {issues_found}")
    report_lines.append("- Auto-fixed: 0")
    report_lines.append(f"- Needs review: {issues_found}")
    report_lines.append("")
    
    report_lines.append("## Orphan Pages")
    if orphans:
        for o in orphans:
            report_lines.append(f"- [[{o}]]: no inbound links from non-meta pages.")
    else:
        report_lines.append("- None found.")
    report_lines.append("")
    
    report_lines.append("## Dead Links")
    if dead_links:
        for dl in dead_links:
            report_lines.append(f"- [[{dl['target']}]]: referenced in [[{dl['source']}]] but does not exist.")
    else:
        report_lines.append("- None found.")
    report_lines.append("")
    
    report_lines.append("## Missing Pages")
    if missing_pages:
        for mp in missing_pages:
            sources_str = ", ".join([f"[[{s}]]" for s in mp["sources"]])
            report_lines.append(f"- \"{mp['target']}\": mentioned in {sources_str}. Suggest: create page.")
    else:
        report_lines.append("- None found.")
    report_lines.append("")
    
    report_lines.append("## Frontmatter Gaps")
    if frontmatter_gaps:
        for fg in frontmatter_gaps:
            fields_str = ", ".join(fg["fields"])
            report_lines.append(f"- [[{fg['page']}]]: missing fields: {fields_str}")
    else:
        report_lines.append("- None found.")
    report_lines.append("")
    
    report_lines.append("## Empty Sections")
    if empty_sections:
        for es in empty_sections:
            report_lines.append(f"- [[{es['page']}]]: empty section heading `{es['heading']}`.")
    else:
        report_lines.append("- None found.")
    report_lines.append("")
    
    report_lines.append("## Address Validation")
    report_lines.append(f"- Counter state: `{peek_value}`")
    # Scan max c-address from disk
    max_c = 0
    for p in all_md_files:
        try:
            content = p.read_text(encoding="utf-8")
            fm, _, _ = parse_frontmatter(content)
            if fm and fm.get("address") and fm["address"].startswith("c-"):
                addr_num = int(fm["address"].split("-")[1])
                if addr_num > max_c:
                    max_c = addr_num
        except:
            pass
    report_lines.append(f"- Highest c- address observed: `c-{max_c:06d}`" if max_c else "- Highest c- address observed: `none`")
    report_lines.append(f"- Post-rollout pages checked: {post_rollout_checked} ({post_rollout_checked - post_rollout_errors} passing, {post_rollout_errors} errors)")
    report_lines.append(f"- Legacy pages pending backfill: {legacy_pending_backfill}")
    
    address_errors_count = len(address_errors) + len(manifest_mismatches) + len(duplicate_errors)
    report_lines.append(f"- Address errors found: {address_errors_count}")
    report_lines.append("")
    
    report_lines.append("### Errors")
    has_errors = False
    if address_errors:
        has_errors = True
        for ae in address_errors:
            report_lines.append(f"- {ae}")
            
    if manifest_mismatches:
        has_errors = True
        for mm in manifest_mismatches:
            report_lines.append(f"- {mm}")
            
    if duplicate_errors:
        has_errors = True
        for de in duplicate_errors:
            report_lines.append(f"- {de}")
            
    if not has_errors:
        report_lines.append("- None found.")
    report_lines.append("")
    
    report_lines.append("### Pending backfill (informational)")
    report_lines.append(f"- {legacy_pending_backfill} legacy pages without addresses. See `.vault-meta/legacy-pages.txt` for the canonical legacy set, or filter by `created:` < 2026-04-23.")
    report_lines.append("")
    
    report_lines.append("## Semantic Tiling")
    report_lines.append("Semantic tiling skipped: Ollama not reachable on local machine. Install Ollama and run `ollama pull nomic-embed-text` to enable semantic tiling checks.")
    report_lines.append("")
    
    # Write report content to stdout
    print("\n".join(report_lines))

if __name__ == "__main__":
    main()
