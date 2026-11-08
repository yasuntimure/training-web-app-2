'use strict';

const EXERCISES = {
  squat: {
    name: 'Kettlebell Goblet Squat', rx: '2 × 6–8', sets: 2, load: true, restSec: 120,
    demo: 'kettlebell goblet squat proper form',
    notes: 'Hold the bell close to your chest. Keep your whole foot grounded and let your knees follow your toes. Squat to a comfortable depth, then stand smoothly. Finish with about three good repetitions still available.'
  },
  hinge: {
    name: 'Barbell Romanian Deadlift', rx: '2 × 6–8', sets: 2, load: true, restSec: 120,
    loadLabel: 'Total barbell weight · kg', demo: 'barbell Romanian deadlift proper form',
    notes: 'Start standing with the bar close to your thighs. Soften your knees, push your hips back, and keep the bar close to your legs. Stop before your back position changes; the bar does not need to reach the floor. Stand by driving your hips forward. Log the bar plus plates.'
  },
  press: {
    name: 'Single-arm KB Floor Press', rx: '2 × 6–8 / side', sets: 2, load: true, bothSides: true, restSec: 120,
    demo: 'single arm kettlebell floor press proper form',
    notes: 'Lie on your back with knees bent. Keep your wrist stacked over your elbow. Lower until your upper arm gently meets the floor, then press upward without twisting. Use both hands to safely position and put down the bell. Complete both arms for each set.'
  },
  row: {
    name: 'Supported Kettlebell Row', rx: '2 × 6–8 / side', sets: 2, load: true, bothSides: true, restSec: 120,
    demo: 'bench supported single arm kettlebell row technique',
    notes: 'Support your free hand on a stable bench. Keep your torso steady and pull the bell toward your lower ribs. Lower with control and avoid rotating to lift the weight. Complete both arms for each set.'
  },
  carry: {
    name: 'Suitcase Carry', rx: '2 × 20–30 s / side', sets: 2, load: true, bothSides: true, restSec: 90,
    demo: 'kettlebell suitcase carry proper form',
    notes: 'Carry one bell beside your body. Walk with small, steady steps, keeping your ribs over your pelvis and shoulders level. Breathe normally and avoid leaning. Complete both sides for each set.'
  },
  ankles: {
    name: 'Ankle Rocks', rx: '2 × 8 / side', sets: 2, bothSides: true,
    demo: 'half kneeling ankle rocks mobility heel down',
    notes: 'In a supported half-kneeling position, slowly move your front knee forward over your toes while keeping the heel down. Stay within a comfortable range. Do eight repetitions per ankle, then tick one set.'
  },
  wall: {
    name: 'Wall Slides', rx: '1 × 8 slow', sets: 1,
    demo: 'wall slide shoulder mobility exercise',
    notes: 'Stand facing a wall with your forearms resting against it. Slowly slide your arms upward and return, keeping your ribs relaxed. Work within a comfortable shoulder range; avoid forcing the movement.'
  },
  cardio: {
    name: 'Brisk Walk or Easy Cycling', rx: '20–30 min', sets: 1, tickLabel: 'Done',
    notes: 'Choose walking or cycling. Start gently, then settle into a steady pace where you can speak in full sentences. Finish with a few easier minutes. This should leave you feeling ready for the next day.'
  },
  hips: {
    name: '90/90 Hip Switches', rx: '2 × 6 switches', sets: 2,
    demo: 'supported seated 90 90 hip switches mobility',
    notes: 'Sit with both knees bent and use your hands for support. Slowly move your knees from one side to the other. Each change of side counts as one switch; do six total per set. Reduce the range if your knees or hips feel pinched.'
  },
  rotation: {
    name: 'Side-lying Upper-back Rotation', rx: '1 × 8 / side', sets: 1, bothSides: true,
    demo: 'side lying open book thoracic rotation exercise',
    notes: 'Lie on your side with knees bent and stacked, arms reaching forward. Open your top arm and gently rotate your chest while keeping your knees together. Return slowly. Complete eight repetitions on each side.'
  },
  balance: {
    name: 'Single-leg Balance & Reaches', rx: '2 × 30 s / side', sets: 2, bothSides: true,
    demo: 'single leg balance reach exercise beginner',
    notes: 'Stand beside a stable support. Balance on one leg with a soft knee and gently reach your free foot forward and sideways. Keep reaches small and controlled. Touch the support whenever needed. Complete both legs for each set.'
  },
  easyWalk: {
    name: 'Relaxed Walk', rx: '10–20 min', sets: 1, tickLabel: 'Done', optional: true,
    notes: 'An optional easy stroll. Keep the effort relaxed. Resting instead is fine today; this walk does not count toward session completion.'
  },
  hipStretch: {
    name: 'Half-kneeling Hip-flexor Stretch', rx: '2 × 20–30 s / side', sets: 2, bothSides: true,
    demo: 'half kneeling hip flexor stretch pelvic tilt',
    notes: 'Kneel on a padded surface with one foot in front. Gently tuck your pelvis and shift forward slightly until you feel a mild stretch at the front of the trailing hip. Keep your lower back comfortable. Repeat on both sides.'
  },
  calfStretch: {
    name: 'Calf Stretch', rx: '2 × 20–30 s / side', sets: 2, bothSides: true,
    demo: 'standing wall calf stretch heel down',
    notes: 'Place your hands on a wall. Step one leg back and keep that heel grounded and knee straight. Lean forward gently until you feel a mild calf stretch. Hold without bouncing, then switch sides.'
  }
};

const items = (...ids) => ids.map(id => ({ id, ...EXERCISES[id] }));
const WARMUP = 'Warm up for 3–5 minutes, then do 1–2 light practice sets before your first loaded movements. Keep about three good repetitions in reserve.';
const squatDay = label => ({ label, title: 'Squat & Hinge', sub: '20–30 min · 3 main things', intro: WARMUP,
  blocks: [{ name: 'Strength · steady and controlled', items: items('squat', 'hinge') }, { name: 'Ankle mobility', items: items('ankles') }] });
const upperDay = label => ({ label, title: 'Push, Pull & Carry', sub: '25–35 min · 4 main things', intro: WARMUP,
  blocks: [{ name: 'Strength · steady and controlled', items: items('press', 'row', 'carry') }, { name: 'Shoulder mobility', items: items('wall') }] });

const PROGRAM = {
  mon: squatDay('Mon'),
  tue: upperDay('Tue'),
  wed: { label: 'Wed', title: 'Stamina & Mobility', sub: '25–35 min · 3 main things', intro: 'Move at a conversational pace. Give your hips and upper back time to move comfortably.',
    blocks: [{ name: 'Steady cardio', items: items('cardio') }, { name: 'Mobility · slow and comfortable', items: items('hips', 'rotation') }] },
  thu: squatDay('Thu'),
  fri: upperDay('Fri'),
  sat: { label: 'Sat', title: 'Coordination & Stamina', sub: '25–35 min · 3 main things', intro: 'Practise the balance drill while fresh, then enjoy steady cardio and a little hip mobility.',
    blocks: [{ name: 'Coordination', items: items('balance') }, { name: 'Steady cardio', items: items('cardio') }, { name: 'Hip mobility', items: items('hips') }] },
  sun: { label: 'Sun', title: 'Gentle Recovery', sub: '5–25 min · 3 simple options', intro: 'Keep today gentle. The walk is optional; stretches should feel comfortable, never forced.',
    blocks: [{ name: 'Easy movement · optional', items: items('easyWalk') }, { name: 'Gentle flexibility', items: items('hipStretch', 'calfStretch') }] }
};

const REFERENCE = `
<details class="ref" open><summary>The simple plan</summary><div class="refbody">
<p>Five main movements: <b>squat, hinge, push, pull, carry.</b> Four short strength sessions, three easier days, and mobility throughout the week.</p>
<p>Repeat the same week for <b>6–8 weeks</b>. Monday and Thursday match; Tuesday and Friday match. Practise smooth movement and build confidence with the same exercises.</p>
<p>KB means kettlebell. <b>2 × 6–8</b> means two working sets of six to eight repetitions. For one-sided exercises, each set tick means you have completed <b>both sides</b>.</p>
</div></details>
<details class="ref"><summary>Effort & progression</summary><div class="refbody">
<p>Warm up for 3–5 minutes, then use 1–2 light practice sets before your first loaded movements. These are not working sets.</p>
<p>Choose a weight that leaves <b>about three good repetitions available</b>. Rest 90–120 seconds between working sets, longer if you need it.</p>
<p>When both sets reach eight smooth repetitions with that reserve, try the next small weight increase. Keep the number of sets unchanged initially. If the next kettlebell is too heavy, stay with your current bell.</p>
<p>For carries, reach 30 comfortable seconds on both sides before increasing the load. If recovery suffers, use one working set per exercise or take an extra easy day.</p>
</div></details>
<details class="ref"><summary>Mobility & joint care</summary><div class="refbody">
<p>Move through a comfortable range and use gentle tension for stretches. Avoid forcing end positions or bouncing.</p>
<p>These drills are general joint care, not treatment for an injury. Stop or modify a movement that causes sharp or increasing joint pain. Persistent pain or instability needs a targeted assessment.</p>
</div></details>
<details class="ref"><summary>Recovery & fuel</summary><div class="refbody">
<p>Eat enough to maintain your usual weight and support training. The program's protein target is approximately <b>90–110 g per day</b>. Aim for 7–9 hours of sleep.</p>
<p>Follow your strength, energy, and weight trend over several weeks. If weight is consistently falling, increase food intake. Build aerobic activity gradually; brisk walking outside these sessions also counts.</p>
</div></details>
<details class="ref"><summary>Using this app</summary><div class="refbody">
<p>Each tab shows that day's session in the <b>current Monday–Sunday week</b>. Ticks are saved by the session date. A new week starts with fresh ticks; previous weeks remain in your backup.</p>
<p>Working weights carry over between matching sessions. Log the weight of <b>one kettlebell</b>, or the <b>bar plus plates</b> for Romanian deadlifts.</p>
<p>Your log stays in this browser. <b>Back up log</b> downloads a copy; <b>Restore log</b> lets you recover it. Clearing browser data removes the local log. Adding the app to your home screen makes it easy to open at the gym.</p>
<p>After the first online visit, the app can open offline. <b>Find demo</b> opens a YouTube search and needs internet; the written technique notes remain available offline.</p>
</div></details>
<details class="ref"><summary>Program & design sources</summary><div class="refbody">
<p>Visual design adapted from <a href="https://github.com/yasuntimure/training-web-app" target="_blank" rel="noopener">training-web-app</a>.</p>
<p>Training principles: <a href="https://acsm.org/wp-content/uploads/2026/03/Resistance-Training-Position-Stand-infographic.pdf" target="_blank" rel="noopener">ACSM resistance-training guidance</a>. Flexibility: <a href="https://www.nhs.uk/live-well/exercise/flexibility-exercises/" target="_blank" rel="noopener">NHS flexibility exercises</a>.</p>
</div></details>`;
