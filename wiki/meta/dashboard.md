---
type: meta
title: "Dashboard"
updated: 2026-06-26
---
# Wiki Dashboard

## Databases (Bases)
Natively visualized databases using Obsidian Bases:

### Ulama & Tokoh
![[Daftar Ulama.base#Daftar Tokoh & Ulama]]

### Konsep Keislaman
![[Daftar Konsep.base#Daftar Konsep Keislaman]]

### Sumber Rujukan
![[Daftar Sumber.base#Daftar Sumber Rujukan]]

## Recent Activity
```dataview
TABLE type, status, updated FROM "wiki" SORT updated DESC LIMIT 15
```

## Seed Pages (Need Development)
```dataview
LIST FROM "wiki" WHERE status = "seed" SORT updated ASC
```

## Entities Missing Sources
```dataview
LIST FROM "wiki/entities" WHERE !sources OR length(sources) = 0
```

## Open Questions
```dataview
LIST FROM "wiki/questions" WHERE answer_quality = "draft" SORT created DESC
```

