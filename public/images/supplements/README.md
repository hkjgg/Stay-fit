# Scene 4 product images

Scene 4 (`src/components/sections/FuelRecovery.tsx`) binds each product card
to one file in this directory. Drop the images in with these exact names and
they render automatically — no code change needed:

| File                        | Product                                  |
| --------------------------- | ---------------------------------------- |
| `pr-micro-creatine.png`     | PR Sciences Micro Creatine (Larry Wheels) |
| `pr-essentials-eaas.png`    | PR Sciences Essentials EAAs (Sour Gummy) |
| `bpi-vegan-protein.png`     | BPI Sports Vegan Protein (Chocolate)     |
| `tiptop-mint-lemonade.png`  | Tip Top Sports Drink — Mint Lemonade     |
| `tiptop-fruits-punch.png`   | Tip Top Sports Drink — Fruits Punch      |
| `tiptop-glowberry.png`      | Tip Top Sports Drink — Glowberry         |

Notes:

- Each image renders centered with `object-contain`, so any aspect ratio is
  preserved — no stretching or cropping.
- Prefer **background-removed PNGs**. The cards are dark glassmorphism; a
  photo with a white or grey background will read as a bright rectangle
  rather than a product floating on the card.
- If a file is absent, that card falls back to a procedural silhouette in
  the product's shape and brand color, so a missing asset never renders a
  broken-image icon.
