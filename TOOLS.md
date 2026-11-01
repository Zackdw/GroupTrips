# Toolkit

Outside tools this repo uses, and where each one plugs in.

| Tool | Used for | How it's wired in |
|------|----------|-------------------|
| [Leaflet](https://github.com/Leaflet/Leaflet) 1.9.4 | Maps on exercise pages ("drop pins where you want to go") | CDN, pinned — see `templates/exercise/index.html` |
| [SurveyJS](https://github.com/surveyjs/survey-library) 3.2.1 (`survey-core` + `survey-js-ui`) | Forms, rankings, multi-step exercises | CDN, pinned — see `templates/exercise/index.html` |
| [React Bits](https://github.com/DavidHDev/react-bits) (SplitText, AnimatedContent, ClickSpark, GradientText) | Animated titles, cards that rise in on scroll, tap sparks | Copied into `fx/src/react-bits/`, bundled by `fx/` → `docs/assets/fx/` (see `fx/README.md`). MIT + Commons Clause: use on our site, don't redistribute the components alone |
| [Three.js](https://github.com/mrdoob/three.js) 0.187.0 | Faint 3D Fruit Gang strawberries drifting behind pages | `fx/src/strawberries.js`, same bundle |
| Google Sheets + Apps Script | Storing responses from GitHub Pages (Pages has no backend) | `templates/exercise/apps-script/Code.gs` — one Sheet for all trips, one tab per exercise |
| [Rallly](https://github.com/lukevella/rallly) | Date / availability polls | Hosted at rallly.co, no accounts needed; paste the poll link in the trip README |
| Messenger polls | Quick single-question votes | Built into the group chat |

## Reference

- [ratgr/viajes-2](https://github.com/ratgr/viajes-2) — itinerary + map pages generated from YAML and published on GitHub Pages. Model for a later "itinerary view" page.

## Considered, not using

- [TREK](https://github.com/liketrek/TREK), [AdventureLog](https://github.com/seanmorley15/AdventureLog) — full collaborative trip planners, but self-hosted and every friend needs an account.
- Spliit / IHateMoney / Splitwise — not needed.
- Messenger bots — Meta's API only covers business Pages, not personal group chats.

## One-time setup: response collection

1. Create a Google Sheet (e.g. "GroupTrips responses").
2. Extensions → Apps Script → paste `templates/exercise/apps-script/Code.gs` → Save.
3. Deploy → New deployment → type **Web app** → Execute as **Me**, access **Anyone** → Deploy.
4. Copy the `/exec` URL into the `ENDPOINT` constant of each exercise page. Current endpoint (already in the template):
   https://script.google.com/macros/s/AKfycbwD94U0vem3i3YxjmKiY22gIBXUHNy30yQ7N1dbH19P2S8FsHgD4VMSnI2ZBSouLTmZ/exec
5. After editing `Code.gs`, redeploy via Deploy → Manage deployments → ✏️ → New version, which keeps the same URL. "Who has access" must be **Anyone**.

The endpoint URL is public (it's in the page source), so anyone with it could post junk rows. Fine for friends; rotate it by redeploying if it ever matters.
