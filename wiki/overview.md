---
type: overview
title: "Wiki Overview"
created: "2026-06-07"
updated: "2026-06-30"
tags:
  - meta
  - overview
status: developing
related:
  - "[[index]]"
  - "[[hot]]"
  - "[[log]]"

---


# Ringkasan Wiki (Overview)

Navigasi: [[index|Indeks]] | [[hot|Konteks Terbaru]] | [[log|Catatan Operasi]]

---

## Tujuan

Wiki ini adalah **Ilmuzip Vault** — sebuah second brain dan mesin riset yang dinamis untuk kajian keislaman, koleksi ceramah/kajian, serta draf kreatif. Wiki ini mendukung pembuatan konten untuk:
- Kanal YouTube **KICIKKU** (naskah video, draf video, catatan klip pendek)
- Akun X **@jamaahquba** (postingan edukatif, utas/threads)
- Draf artikel panjang dan bahan rujukan ceramah.

---

## Status Saat Ini
 
 - Sumber diimpor (ingested): 86
 - Halaman wiki: 555
 - Aktivitas terakhir: 2026-06-30 (Mengimpor ringkasan hadis Meem Bagian 07 Fayd al-Qadir mengenai Ihya al-Mawat, kebersihan jalan, dan keikhlasan)

---

## Struktur & Organisasi Folder

- `.raw/` berisi dokumen mentah hasil transkrip, rujukan artikel, tautan referensi, dan unduhan teks ceramah.
- `wiki/sources/` berisi ringkasan kajian tertentu, buku yang dibaca, atau catatan dari sini.
- `wiki/concepts/` memetakan konsep dan prinsip utama keislaman (seperti Fiqh, Aqidah, terminologi Hadis).
- `wiki/entities/` mengkatalogkan ulama, ustadz, pembicara, organisasi, dan tokoh-tokoh sejarah Islam.
- `wiki/drafts/` adalah tempat kerja untuk merancang utas X, naskah untuk KICIKKU, dan artikel panjang.
- `wiki/questions/` menyimpan catatan tanya jawab penelitian keagamaan.
- `wiki/meta/` berisi templat, kalender konten, daftar periksa, dan konfigurasi alur kerja.

---

## Alur Produksi Konten

1. **Ingest (Impor)**: Simpan transkrip mentah, artikel, atau catatan ke dalam folder `.raw/`. Minta asisten untuk mengimpornya dengan perintah `"ingest [nama-file]"`.
2. **Sintesis**: Hubungkan catatan dengan ulama (`wiki/entities`) dan ide-ide kunci (`wiki/concepts`).
3. **Draf**: Buat draf naskah atau postingan di `wiki/drafts/` dengan memanfaatkan rujukan/sitasi yang sudah ada di wiki.
4. **Publikasi**: Salin draf tersebut untuk dipublikasikan di KICIKKU atau @jamaahquba, lalu ubah status draf menjadi `published`.