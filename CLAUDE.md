# Ilmuzip Vault: LLM Wiki

Metode: Gabungan Penelitian (Mode E) & Produksi Konten (Mode F)
Tujuan: Penelitian tentang ilmu keislaman, koleksi ceramah/kajian, serta draf artikel, postingan, dan video (KICIKKU, @jamaahquba).
Pemilik: Firas Raf Islam
Dibuat: 2026-06-07

## Struktur Folder

```
ilmuzip-vault/
├── .raw/               # Sumber mentah, transkrip kajian, referensi (tidak boleh diubah)
├── wiki/
│   ├── index.md        # Katalog utama seluruh halaman wiki
│   ├── log.md          # Catatan kronologis semua operasi wiki
│   ├── hot.md          # Hot cache: ringkasan konteks terbaru (~500 kata)
│   ├── overview.md     # Ringkasan eksekutif seluruh wiki
│   ├── sources/        # Ringkasan kajian, buku, atau artikel yang disintesis
│   ├── concepts/       # Istilah, konsep, dan prinsip keislaman
│   ├── entities/       # Ulama, ustadz, tokoh sejarah, organisasi, kanal
│   ├── drafts/         # Draf artikel, utas/postingan X (@jamaahquba), naskah YouTube (KICIKKU)
│   ├── comparisons/    # Analisis perbandingan dan pemetaan topik
│   ├── questions/      # Jawaban atas pertanyaan penelitian keagamaan/sejarah
│   └── meta/           # Dasbor, templat, kalender konten, laporan kesehatan wiki
└── _templates/         # Templat catatan untuk Obsidian (menggunakan Templater)
```

## Aturan & Konvensi

- Semua catatan wajib memiliki YAML frontmatter minimal: type, status, created, updated, tags
- Wikilink menggunakan format [[Nama Catatan]]: nama file harus unik, tidak perlu menuliskan path folder
- Folder .raw/ berisi dokumen sumber: jangan pernah mengubah isinya
- wiki/index.md adalah katalog utama: wajib diperbarui setiap kali mengimpor (*ingest*) sumber baru
- wiki/log.md bersifat append-only: jangan pernah mengedit catatan log masa lalu
- Entri log baru selalu diletakkan di bagian paling ATAS file

## Operasi

- Ingest (Impor): Letakkan dokumen sumber di dalam .raw/, lalu minta asisten: "ingest [nama-file]"
- Query (Tanya): Ajukan pertanyaan apa pun: Asisten akan membaca indeks terlebih dahulu sebelum mendalami halaman yang relevan
- Lint (Periksa): Katakan "periksa wiki" (*lint the wiki*) untuk menjalankan pemeriksaan tautan mati dan halaman yatim
- Archive (Arsip): Pindahkan sumber yang sudah lama ke .archive/ untuk menjaga kebersihan folder .raw/
