# Batch INDD to IDML Converter

A simple **Adobe InDesign ExtendScript (`.jsx`)** that batch-exports `.indd` documents to `.idml` — including documents in nested subfolders.

I made this to preserve access to older InDesign projects when moving away from an Adobe subscription. Instead of opening and exporting every document manually, run the script once and choose your project folder.

## Features

- **Batch export:** Converts multiple `.indd` files to `.idml` using Adobe InDesign.
- **Recursive search:** Finds documents in the selected folder and all subfolders.
- **Keeps originals:** Does not save changes to the source `.indd` files.
- **Preserves folder structure:** Writes each `.idml` beside its original document.
- **Skips existing exports:** Does not overwrite an `.idml` file with the same name.
- **Error handling:** Logs individual conversion failures and continues processing.
- **Conversion log:** Writes `INDD_to_IDML_conversion_log.txt` in the selected root folder, with results and totals.

## Requirements

- Adobe InDesign with ExtendScript (`.jsx`) support
- Read access to the `.indd` documents and write access to their folders

**InDesign must be installed and able to open the source files.** This is an automation script for InDesign, not a standalone INDD converter.

## Installation and usage

1. Download `Batch_INDD_to_IDML.jsx` from this repository.
2. Open **Adobe InDesign**.
3. Open **Window → Utilities → Scripts**.
4. In the Scripts panel, right-click **User** and choose **Reveal in Explorer** (Windows) or **Reveal in Finder** (macOS).
5. Copy `Batch_INDD_to_IDML.jsx` into that folder.
6. Double-click the script in the InDesign Scripts panel.
7. Select the folder containing your `.indd` documents. Subfolders are included automatically.
8. When processing finishes, review the summary and the log file.

### Example

Before:

```text
Manuals/
├── Product A/
│   └── Product A Manual.indd
└── Product B/
    └── Product B Manual.indd
```

After:

```text
Manuals/
├── INDD_to_IDML_conversion_log.txt
├── Product A/
│   ├── Product A Manual.indd
│   └── Product A Manual.idml
└── Product B/
    ├── Product B Manual.indd
    └── Product B Manual.idml
```

## How it works

The script uses InDesign's built-in `ExportFormat.INDESIGN_MARKUP` export functionality. It opens each source document without displaying a document window, exports an IDML file, and closes the source document **without saving changes**.

It temporarily suppresses interactive prompts and link checking while processing, then restores the original InDesign preferences when finished.

The log records successful exports (`OK`), existing IDML files (`SKIP`), and errors (`FAILED`). A final summary includes the number of documents found, exported, skipped and failed.

## Important notes

- **Test on a small folder first** and keep backups of important documents.
- An existing `.idml` file will be skipped even if the `.indd` source has since changed. Delete or move the old `.idml` if you want it regenerated.
- IDML is an interchange format; opening it in other layout applications may change text flow, fonts, pagination or unsupported features. Review each converted document.
- Linked assets and fonts may still need to be preserved separately.
- If a source document needs manual attention (such as repair or an incompatibility warning), the suppressed prompts may cause that export to fail; inspect the log and open the affected document manually.
- The script does **not** create PDF exports or package linked files.

## Files

| File | Purpose |
| --- | --- |
| `Batch_INDD_to_IDML.jsx` | InDesign batch conversion script |
| `README.md` | Usage instructions |

## License

No license is specified here. If you intend others to reuse or modify the code, consider adding a `LICENSE` file (for example, MIT).
