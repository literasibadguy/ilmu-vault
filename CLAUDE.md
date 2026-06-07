# Ilmuzip Vault: LLM Wiki

Mode: Combined Research (Mode E) & Content Production (Mode F)
Purpose: Research on Islamic knowledges, lecture/kajian collections, and drafts for articles, posts, and videos (KICIKKU, @jamaahquba).
Owner: Firas RafiIslam
Created: 2026-06-07

## Structure

```
ilmuzip-vault/
├── .raw/               # Raw lectures, transcript clips, references (immutable)
├── wiki/
│   ├── index.md        # Master catalog of all pages
│   ├── log.md          # Chronological record of all vault operations
│   ├── hot.md          # Hot cache: recent context summary (~500 words)
│   ├── overview.md     # Executive summary of the whole wiki
│   ├── sources/        # Synthesized lecture notes, books, articles
│   ├── concepts/       # Islamic concepts, terminology, core principles
│   ├── entities/       # Scholars, speakers, historical figures, organizations
│   ├── drafts/         # Drafts for articles, X posts (@jamaahquba), YouTube scripts (KICIKKU)
│   ├── comparisons/    # Side-by-side analysis, comparisons, topic mappings
│   ├── questions/      # Answers to theological or historical research questions
│   └── meta/           # Dashboards, templates, content calendars, lint reports
└── _templates/         # Note templates for Obsidian
```

## Conventions

- All notes use YAML frontmatter: type, status, created, updated, tags (minimum)
- Wikilinks use [[Note Name]] format: filenames are unique, no paths needed
- .raw/ contains source documents: never modify them
- wiki/index.md is the master catalog: update on every ingest
- wiki/log.md is append-only: never edit past entries
- New log entries go at the TOP of the file

## Operations

- Ingest: drop source in .raw/, say "ingest [filename]"
- Query: ask any question: Claude reads index first, then drills in
- Lint: say "lint the wiki" to run a health check
- Archive: move cold sources to .archive/ to keep .raw/ clean
