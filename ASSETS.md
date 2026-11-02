# Asset map

Where every image lives. `assets/` is the source of truth; the app folders hold copies
that the bundlers actually serve.

## `assets/` (repository root)

```
assets/
├── backgrounds/
│   ├── fantasy-party/                  masters (in use)
│   │   ├── fantasy-party-raw.png               landscape 1408x768
│   │   └── fantasy-party-portrait-raw.png      portrait  768x1376
│   ├── fantasy-party-1920.jpg / .webp   exported, landscape
│   ├── fantasy-party-1280 / 768         smaller landscape sizes
│   ├── fantasy-party-portrait-1080/720/480
│   └── cosmic-nebula-unused/           earlier space art, kept but unused
│
└── characters/
    ├── roster/                         the 27-character roster
    │   ├── set1-elite/      (9)  ornate / elite hoods
    │   ├── set2-themed/     (9)  themed hoods
    │   ├── set3-classic/    (9)  classic hooded crewmates
    │   └── manifest.json         index: id, name, set, file, grid position
    │
    └── variants/                       START-SCREEN poses, transparent cut-outs
        ├── pose-a-pointing-cut.png     red   — pointing up
        ├── pose-b-waving-cut.png       cyan  — waving
        ├── pose-c-shrug-cut.png        galaxy — shrugging
        ├── thumbs/                     192px head crops for loading tiles
        └── web/                        640px WebP for the web stage
```

## What the start + loading screens use

| Character | Gesture | Art |
| --- | --- | --- |
| Red | pointing up | `characters/variants/pose-a-pointing-cut.png` |
| Cyan | waving | `characters/variants/pose-b-waving-cut.png` |
| Cosmic | shrugging | `characters/variants/pose-c-shrug-cut.png` |

Three **different** gestures on purpose — the stage must never look like one character
copied three times.

Background: `backgrounds/fantasy-party-*` (floating castle, pink clouds, sparkles).

## Where the apps read from

```
apps/web/public/
├── backgrounds/     fantasy-party-{1920,1280,768}.jpg/.webp + portrait-1080
└── characters/
    └── start/       pose art (webp + png) and 192px thumbs

apps/mobile/assets/
├── backgrounds/     fantasy-party-portrait-720.jpg, fantasy-party-landscape-1280.jpg
└── characters/
    └── start/       pose art (transparent PNG) + thumbs
```

## Rules

1. Images live only in `public/` (web) and `assets/` (mobile) — never inside `src/`.
2. Components never hardcode a filename. They read
   `apps/web/src/data/characters.ts` and `apps/mobile/src/data/characters.ts`.
3. Only the 3 start-screen characters ship inside the apps, because only those are on screen
   today. The 27-character roster stays in `assets/characters/roster/` and gets copied into
   each app when the character-picker screen is actually built. Nothing imports it yet.
4. **Mobile gotcha:** React Native `shadow*` props draw around the element box, not the image
   silhouette, so they paint a soft rectangle behind transparent PNGs. Use art with baked-in
   depth, or `react-native-shadow-2`.
5. Roster JPEGs were 301x379 per cell; shipped PNGs are 2x upscaled (602x~750). Replace with
   high-res originals if a roster character is ever shown full-screen.
