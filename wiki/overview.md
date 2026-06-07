---
type: overview
title: "Wiki Overview"
created: 2026-06-07
updated: 2026-06-07
tags:
  - meta
  - overview
status: developing
related:
  - "[[index]]"
  - "[[hot]]"
  - "[[log]]"
---

# Wiki Overview

Navigation: [[index]] | [[hot]] | [[log]]

---

## Purpose

This vault is the **Ilmuzip Vault** — a compounding, persistent second brain and research engine for Islamic knowledges, lecture/kajian collections, and creative drafts. It supports content creation for:
- YouTube channel **KICIKKU** (scripts, video drafts, short clip notes)
- X account **@jamaahquba** (educational posts, threads)
- Long-form article drafts and reference materials.

---

## Current State

- Sources ingested: 1
- Wiki pages: 12
- Last activity: 2026-06-07 (Ingested Pemimpin yang Mengkhianati Rakyatnya)

---

## Structure & Organization

- `.raw/` contains raw transcripts, article sources, references, and audio/video text downloads.
- `wiki/sources/` contains summaries of specific lectures (kajians), books read, or podcasts.
- `wiki/concepts/` maps core Islamic concepts and principles (e.g. Fiqh, Aqidah, Hadith terminology).
- `wiki/entities/` catalogs scholars, channels, speakers, organizations, and historical figures.
- `wiki/drafts/` is the workbench for drafting X posts, scripts for KICIKKU, and long-form articles.
- `wiki/questions/` holds research QA summaries.
- `wiki/meta/` houses templates, calendars, checklists, and pipeline configurations.

---

## Content Production Pipeline

1. **Ingest**: Drop raw transcripts, articles, or notes into `.raw/`. Run `ingest [filename]`.
2. **Synthesize**: Link notes to scholars (`wiki/entities`) and key ideas (`wiki/concepts`).
3. **Draft**: Create scripts or posts in `wiki/drafts/` utilizing research/citations from the wiki.
4. **Publish**: Copy from drafts to publish on KICIKKU or @jamaahquba, marking status as `published`.
