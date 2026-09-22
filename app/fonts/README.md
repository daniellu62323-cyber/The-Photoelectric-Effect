# fonts/

**Schoolbell** — `schoolbell.woff2`, Latin subset, 21 KB.

Designed by Font Diner. Copyright (c) 2010 Font Diner, Inc.
Licensed under the **Apache License 2.0** — full text in `LICENSE.txt`.
Source: <https://fonts.google.com/specimen/Schoolbell>

Self-hosted rather than loaded from a CDN, for two reasons: the presentation
must render identically with the network unplugged, and `quiz.html` has a 50 KB
budget that a third-party request would put at the mercy of classroom wifi.

**It has no Greek.** No λ, no φ, no subscript zero — measured, not assumed.
Those fall through to the body sans, which is why `--hand` in `theme.css` ends
in `--ink` and never reaches serif. See the note there.
