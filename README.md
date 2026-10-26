# Result Management System

A small teacher-facing app for recording student results and viewing them in one
place. Built with plain HTML, CSS and JavaScript — no dependencies, no build step.

## Pages

- **`index.html`** — every student result, with add and delete.
- **`form.html`** — form for adding a new result.

## Run

Open `index.html` directly in a browser — that is the whole setup.

Or serve the folder over HTTP:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Structure

```
index.html        Home page
form.html         Add result form
css/              Design tokens, base, layout, components, utilities
js/               Config, storage, repository, validators, UI, controllers
```

Results are saved in the browser's `localStorage`.
# native-rms
