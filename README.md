# Ilmuzip Vault

**Ilmuzip Vault** adalah pilar penyimpanan pengetahuan (*compounding knowledge base*) dan mesin riset dinamis untuk kajian keislaman, koleksi transkrip ceramah. Vault ini dirancang untuk memetakan konsep-konsep keagamaan secara mendalam dan mengalirkan hasil riset tersebut menjadi konten edukasi publik.

---

## 📌 Tujuan & Fokus Utama
*   **Riset Keagamaan (Mode E - Penelitian)**: Kajian kitab-kitab klasik salaf (seperti *Ihya' Ulumiddin* karya Imam Al-Ghazali, *Kitab al-Kaba'ir* karya Imam Adh-Dhahabi) dan materi ceramah kontemporer.

---

## 📂 Struktur Folder
Vault ini menggunakan organisasi folder terstruktur untuk memisahkan data mentah dari sintesis pengetahuan:

```
ilmuzip-vault/
├── .raw/               # Sumber mentah (transkrip kajian, referensi, dll) - IMMUTABLE
├── .vault-meta/        # Metadata internal (status lock, counter alamat, transport)
├── _templates/         # Templat catatan Obsidian (menggunakan Templater)
├── scripts/            # Skrip otomatisasi (linting, lock, alokasi alamat)
└── wiki/               # Pengetahuan yang disintesis (Agent-owned)
    ├── index.md        # Katalog utama seluruh halaman wiki
    ├── log.md          # Catatan kronologis semua operasi wiki (append-only)
    ├── hot.md          # Hot cache: ringkasan konteks terbaru (~500 kata)
    ├── overview.md     # Ringkasan eksekutif seluruh wiki
    ├── sources/        # Ringkasan sintesis buku, kajian, atau artikel
    ├── concepts/       # Istilah, konsep, dan prinsip keislaman
    ├── entities/       # Profil ulama, tokoh sejarah, organisasi, dan kanal
    ├── drafts/         # Draf naskah video YouTube, utas X, dan artikel
    ├── comparisons/    # Analisis perbandingan dan pemetaan topik
    ├── questions/      # Jawaban atas pertanyaan penelitian keagamaan
    └── meta/           # Laporan kesehatan (lint), dasbor, kalender konten
```

---

## ⚡ Alur Kerja (Workflow)
Proses kerja vault ini mengutamakan metode *incremental compounding* yang dikelola bersama oleh asisten AI:

1.  **Ingest (Impor)**: Dokumen sumber diletakkan di dalam folder `.raw/`. Panggil asisten dengan perintah: `"ingest [nama-file]"` atau `"ingest [URL]"`. Asisten akan:
    *   Membuat sidik jari MD5 hash dan mencatatnya ke dalam `.raw/.manifest.json`.
    *   Membuat ringkasan sumber di `wiki/sources/`.
2.  **Sintesis**: Menghubungkan ringkasan dengan profil ulama/tokoh (`wiki/entities/`) dan ide-ide kunci (`wiki/concepts/`).
3.  **Address Assignment (DragonScale)**: Setiap halaman baru non-meta akan secara otomatis mendapatkan alamat unik berformat `address: c-XXXXXX` melalui `scripts/allocate-address.sh` demi stabilitas referensi tautan jangka panjang.
4.  **Draf & Produksi**: Memanfaatkan pengetahuan yang telah terpetakan di wiki untuk menyusun naskah di `wiki/drafts/`. Setelah dirilis, status draf diubah menjadi `published`.

---

## 🛠️ Skrip & Otomatisasi
Di dalam folder `scripts/`, terdapat utilitas penting yang dapat dijalankan melalui terminal:

*   **Pemeriksaan Kesehatan (Lint)**:
    ```bash
    python3 scripts/lint-vault.py
    ```
    Memindai seluruh isi vault untuk mendeteksi tautan mati (*dead links*), halaman yatim (*orphans*), dan memvalidasi counter alamat. Laporannya disimpan di `wiki/meta/lint-report-YYYY-MM-DD.md`.
*   **Sistem Penguncian File (Lock)**:
    ```bash
    bash scripts/wiki-lock.sh acquire "wiki/concepts/NamaPage.md"
    bash scripts/wiki-lock.sh release "wiki/concepts/NamaPage.md"
    ```
    Mencegah tabrakan penulisan (*race condition*) antar proses asisten AI dengan kunci advisory file.

---

## ✍️ Aturan Penulisan & Catatan
*   **YAML Frontmatter**: Setiap halaman wiki wajib memiliki frontmatter minimal:
    ```yaml
    ---
    type: [source | concept | entity | draft | question | meta]
    title: "Nama Halaman"
    created: "YYYY-MM-DD"
    updated: "YYYY-MM-DD"
    tags:
      - tag1
    status: [seed | developing | evergreen | published]
    address: c-XXXXXX (jika non-meta)
    ---
    ```
*   **Wikilinks**: Gunakan format `[[Nama Catatan]]` untuk menautkan halaman. Nama berkas wajib unik, sehingga tidak perlu menuliskan path folder.
*   **Custom Callouts**: Vault ini mendukung empat callout khusus di Obsidian (didefinisikan di `.obsidian/snippets/`):
    *   `> [!contradiction]`: Untuk menandai pertentangan klaim antar sumber.
    *   `> [!gap]`: Untuk menandai celah penelitian yang butuh dicari sumbernya.
    *   `> [!key-insight]`: Untuk menyoroti kesimpulan riset yang sangat penting.
    *   `> [!stale]`: Untuk menandai klaim atau draf yang butuh diperbarui.
