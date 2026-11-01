# GroupTrips

Planning hub for group trips with friends. Each trip gets its own folder; shared stuff (people, templates, the public site) lives at the top level.

## Trips

| Trip | Dates | Crew | Status |
|------|-------|------|--------|
| [Japan](trips/2027-02-japan/README.md) | Feb 2027 | TBD | Not started — plan later |
| [Hawaii](trips/2027-04-hawaii/README.md) | ~Apr 2027, ~1 month | 6 | Idea / gathering input |
| [Italy](trips/2027-08-italy/README.md) | Aug 2027 | TBD | Not started — plan later |

## Layout

```
GroupTrips/
├── README.md              ← you are here: index of all trips
├── CLAUDE.md              ← conventions for Claude sessions in this repo
├── TOOLS.md               ← outside tools we use (Leaflet, SurveyJS, Rallly, Sheets) + setup
├── people/
│   └── roster.md          ← friends, handles, preferences (reused across trips)
├── templates/
│   ├── trip/              ← copy this folder to start a new trip
│   ├── messages/          ← status report / ask templates for Messenger & text
│   └── exercise/          ← starter page (form + map) and the Apps Script that collects answers
├── trips/
│   └── YYYY-MM-place/     ← one folder per trip (sorts by date)
│       ├── README.md      ← trip dashboard: dates, crew, status, open questions
│       ├── decisions.md   ← decision log (what, when, who agreed)
│       ├── itinerary.md   ← day-by-day / week-by-week plan
│       ├── budget.md      ← costs and who owes what
│       ├── comms/
│       │   ├── outbox/    ← drafted messages, named YYYY-MM-DD-topic.txt
│       │   └── inbox/     ← replies pasted back from Messenger/text/Zoom notes
│       ├── research/      ← lodging options, activities, flights, notes
│       └── private/       ← confirmations, passport info, etc. (git-ignored)
└── docs/                  ← PUBLIC GitHub Pages site (exercises, polls, itinerary views)
    └── YYYY-MM-place/     ← one subfolder per trip
```

## Workflow

1. **Plan** in `trips/<trip>/` — markdown files are the source of truth.
2. **Send** — draft a message in `comms/outbox/`, copy-paste into Messenger/text. Use Messenger's built-in polls for quick votes and a Rallly poll for dates.
3. **Collect** — paste replies into `comms/inbox/`, then fold the outcome into `decisions.md`.
4. **Exercises** — anything bigger than a poll (ranking activities, picking a house, pinning places on a map) becomes a page under `docs/<trip>/<exercise>/`, copied from `templates/exercise/` and shared by link. Answers land in the Google Sheet (see [TOOLS.md](TOOLS.md)).

## Starting a new trip

Copy `templates/trip/` to `trips/YYYY-MM-place/`, fill in the README, and add a row to the table above.

## Privacy

This whole repo is **public** on GitHub, and `docs/` is served at https://zackdw.github.io/GroupTrips/. Use first names only. Phone numbers, emails, addresses, confirmation numbers, passport info, and money owed go in `trips/<trip>/private/`, which is git-ignored and never leaves this computer.
