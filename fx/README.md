# fx — page effects

Source for the animated bits on the GitHub Pages site. GitHub Pages serves plain files, so this folder is **built** and the output is committed to `docs/assets/fx/`.

```
cd fx
npm install
npm run build      # → docs/assets/fx/hawaii-dates.js (+ .css)
```

Rebuild and commit the output whenever anything in `src/` changes.

## What's here

| File | What it does |
|------|--------------|
| `src/hawaii-dates.jsx` | Entry for the Hawaii dates page: mounts the effects below onto the existing page |
| `src/islands.jsx` | Wraps existing (non-React) page elements in React components without breaking their scripts |
| `src/strawberries.js` | Three.js scene: faint 3D strawberries drifting behind the page (Fruit Gang 🍓) |
| `src/react-bits/` | Components copied from [React Bits](https://github.com/DavidHDev/react-bits) @ `4dc7b5b`: SplitText, AnimatedContent, ClickSpark, GradientText |

## React Bits license

React Bits is MIT + Commons Clause (see `src/react-bits/LICENSE.md`): fine to use as part of this site, but don't sell or redistribute the components on their own. Keep the license file next to the copied components.

Browse more at https://reactbits.dev. To add one, copy its JS + CSS variant from `src/content/<Category>/<Name>/` in the repo into `src/react-bits/`, then import it in the page's entry file.
