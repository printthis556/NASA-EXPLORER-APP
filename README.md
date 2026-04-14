# NASA Space Explorer

[![OpenSSF Scorecard](https://img.shields.io/badge/OpenSSF-Scorecard-blue)](https://scorecard.dev/)
[![OpenSSF Best Practices](https://img.shields.io/badge/OpenSSF-Best%20Practices-blue)](https://bestpractices.coreinfrastructure.org/)

NASA Space Explorer is a front-end web app that helps people browse space images, videos, and facts in one simple place. It gives students and space fans an easy way to explore NASA-inspired media without needing to search across multiple sites.

## Overview

NASA Space Explorer showcases space media inspired by NASA's Astronomy Picture of the Day (APOD). It pulls APOD-style JSON data, renders a responsive gallery of images and videos, and opens each item in a detail modal for a richer viewing experience.

## Highlights

- APOD-style gallery powered by live JSON data
- Support for image and video entries
- Detail modal with title, date, media, and explanation text
- Animated starfield background for a space-themed experience
- Random "Did You Know?" facts loaded from local JSON
- Responsive layout for desktop and mobile

## How to Obtain and Run the Project

1. Clone the repository from GitHub.
	```bash
	git clone https://github.com/your-username/nasa-space-explorer.git
	```
2. Open the project folder in VS Code or your preferred editor.
3. Run the app with a local web server so the JSON files load correctly.

### Option 1: VS Code Live Server

1. Install the Live Server extension if needed.
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

Because this project fetches local JSON files, run it with a local web server instead of opening `index.html` directly.

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

## Feedback and Bug Reports

Use GitHub Issues to report bugs, request features, or share suggestions. For major changes, open an issue first so the discussion stays in one place.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and project expectations.

## Security

See [SECURITY.md](SECURITY.md) for the private reporting process.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.



