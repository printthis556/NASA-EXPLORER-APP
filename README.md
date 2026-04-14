# NASA Space Explorer

[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/printthis556/NASA-EXPLORER-APP/badge)](https://scorecard.dev/viewer/?uri=github.com/printthis556/NASA-EXPLORER-APP)
[OpenSSF Best Practices Badge]

NASA Space Explorer is a front-end web app that showcases space media inspired by NASA's Astronomy Picture of the Day (APOD). It pulls APOD-style JSON data, renders a responsive gallery of images and videos, and opens each item in a detail modal for a richer viewing experience.

## Highlights

- APOD-style gallery powered by live JSON data
- Support for image and video entries
- Detail modal with title, date, media, and explanation text
- Animated starfield background for a space-themed experience
- Random "Did You Know?" facts loaded from local JSON
- Responsive layout for desktop and mobile

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript (no framework)

## Data Sources

- APOD-style media feed:
	https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json
- Space facts:
	data/facts.json

## Getting Started

Because this project fetches local JSON files, run it with a local web server (instead of opening `index.html` directly).

### Option 1: VS Code Live Server

1. Install the Live Server extension (if needed).
2. Open `index.html`.
3. Click "Go Live".

### Option 2: Python Simple Server

From the project root:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

## Project Structure

```text
.
├── index.html
├── style.css
├── js/
│   └── script.js
├── data/
│   └── facts.json
└── img/
```

## How It Works

1. The page starts with a centered hero section and an "Explore the Cosmos" button.
2. On click, the app fetches APOD-style entries from the CDN feed.
3. The first set of entries is rendered as cards in a gallery.
4. Image cards display thumbnails; video cards show a thumbnail and an "Open video" link.
5. Clicking a card opens a modal with expanded content and explanation text.
6. A random space fact is loaded from `data/facts.json` and displayed in the "Did You Know?" panel.

## Customization

- Update visual styles in `style.css`.
- Adjust gallery behavior or rendering rules in `js/script.js`.
- Add or edit trivia in `data/facts.json`.

## Notes

- Media content comes from an external APOD-style feed and may change over time.
- Some video URLs are hosted on third-party platforms (for example, YouTube).

## License

This project is intended for educational and portfolio use. If you plan to distribute it publicly, review media licensing and attribution requirements for third-party content.


