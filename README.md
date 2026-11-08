# Training Web App 2

A small, mobile-first training app for a simple seven-day program. The dark green panels, orange accents, Barlow Condensed / Inter typography, cards, and home-screen icon are retained from [training-web-app](https://github.com/yasuntimure/training-web-app) at commit `892b284`.

## Program

| Day | Focus |
| --- | --- |
| Monday / Thursday | Goblet squat, barbell Romanian deadlift, ankle rocks |
| Tuesday / Friday | Kettlebell floor press, supported row, suitcase carry, wall slides |
| Wednesday | Conversational cardio, hip switches, upper-back rotations |
| Saturday | Balance and reaches, conversational cardio, hip switches |
| Sunday | Optional easy walk, hip-flexor and calf stretches |

Five main loaded movements, two working sets each. Three or four tasks per day. Repeat for 6–8 weeks and progress repetitions before weight. Written technique cues and the full progression guidance are included in the app.

## Features

- Seven separate day tabs plus a compact Info section.
- Accessible set buttons and completion progress, saved per date in the current Monday–Sunday week.
- Shared working weights across matching workouts and previous-session weight display.
- Rest timer with 15-second adjustments and accurate elapsed time after backgrounding.
- Optional screen wake lock where supported.
- Local JSON backup and restore.
- Installable home-screen app with locally bundled fonts and offline caching.

Data is stored only in the browser's local storage, under a key separate from the original app. No analytics, account, backend, or runtime dependencies. A public repository does not publish anyone's workout log. External demo searches require internet.

## Run

Use Node.js 20+ for build and test commands. Python 3 is used by the development-server convenience command. No package installation is necessary.

```sh
npm start
npm test
npm run build
```

Open `http://127.0.0.1:8765/`. The build writes a standalone static app to `dist/`. Deploy that folder to an HTTPS static host; relative URLs also support hosting under a subpath. Service workers require HTTPS or localhost.

## Files

- `program.js`: exercise content and weekly schedule.
- `styles.css` and `assets/`: original visual styling and local fonts.
- `core.js`: date calculation and backup validation.
- `app.js`: rendering, tracking, timer, and backup controls.
- `sw.js`: offline cache, isolated from the original app.
- `.openai/hosting.json`: private Sites deployment configuration.

The mobility drills are general joint-care exercises, not injury rehabilitation. Adjust any painful movement and seek a targeted assessment for persistent pain or instability.
