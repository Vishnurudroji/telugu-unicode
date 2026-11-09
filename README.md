# Telugu Vector Studio

**Preserving Telugu text. Connecting generations of technology.**

A simple tool that converts old **ANU6 / ANU7** Telugu text into **Unicode**, and Unicode back into ANU6 / ANU7. It runs fully in your browser. No backend or installation needed.

---

## Why This Project?

Many Telugu designers, DTP operators, and printing shops still have content in old ANU fonts. This text often breaks or looks wrong in modern Unicode software.

Telugu Vector Studio converts that text so you can reuse it instead of typing everything again.

---

## Screenshots

| ANU to Unicode | Unicode to ANU |
|---|---|
| ![ANU to Unicode](sample-1.png) | ![Unicode to ANU](sample-2.png) |

| Text processing | Conversion interface |
|---|---|
| ![Text processing](sample-3.png) | ![Conversion interface](sample-4.png) |

---

## Features

- ANU7 → Unicode
- ANU6 → Unicode
- Unicode → ANU7
- Unicode → ANU6
- Switch between conversion directions easily
- Smart matching: longer character sequences are converted first
- Unicode NFC normalization for consistent Telugu text
- Works offline in the browser

---

## How to Use

1. Copy text from your ANU document.
2. Paste it into Telugu Vector Studio and choose the conversion type.
3. Copy the converted text.
4. Paste it into software like CorelDRAW or FlexiSIGN.
5. Choose a Telugu Unicode font.
6. Edit as needed, and convert to curves/outlines in your design software if required.

> **Note:** This tool only converts text encoding. Creating outlines or cutting paths is done by your design software.

---

## Getting Started

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Telugu-Vector-Studio
```

Then open `index.html` in your browser, or use the VS Code **Live Server** extension.

---

## Project Structure

```text
Telugu-Vector-Studio/
├── index.html            # Main page
├── style.css             # Styling
├── app.js                # App logic
├── telugu-engine.js      # Conversion engine
├── anu-mapping.csv       # Character mapping data
├── accuracy.html         # Accuracy report
├── accuracy.css
├── documentation.html
├── about.html
└── screenshots/          # Sample images
```

---

## Built With

- HTML5, CSS3
- JavaScript (ES Modules)
- Unicode NFC normalization
- CSV mapping data

---

## Known Limitations

- Conversion depends on the available ANU6 / ANU7 mappings.
- Some old character combinations can be ambiguous.
- Round-trip conversion may not be exact in every case.
- Final look depends on the fonts and Telugu support in your target software.

See the [Accuracy Report](accuracy.html) for details.

---

## Future Plans

- Wider ANU6 / ANU7 mapping coverage
- Better handling of rare character combinations
- Batch file conversion
- Windows desktop app
- Support for more legacy Telugu fonts
- Improved automated accuracy testing

---

## Documentation

- [Project Documentation](documentation.html)
- [Accuracy Report](accuracy.html)
- [About the Project](about.html)

---

## Developer

**Vivek Shanigarapu**
Computer Science student | Software Developer
