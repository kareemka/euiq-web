# PDF design implementation

Reference: `C:/Users/1999k/Downloads/euiq_responsive_web_design_and_development_guide.pdf`, visual boards on pages 13, 19, 23 and 30.

The previous pass matched the palette but differed in composition. This pass corrects:

- Home: left-aligned hero copy area with right-hand artwork, a compact five-column desktop product row, adjacent category and price blocks, teal/gold campaign strip, four assurance tiles.
- Catalog: shallow photographic heading, four category tiles, left desktop filter rail, four-column desktop product grid; responsive filters retain their existing data flow.
- Product: gallery on the left at desktop widths, purchase details on the right, gold sale markers, simpler material/origin rows; mobile stacks naturally.
- Favorites and account states: centered page heading and restrained ivory/teal/gold empty states. Signed-out pages continue to require the existing account flow; no invented saved products or orders.

Preserved: official V logo, actual product imagery/prices/stock, routing, purchase limits, authentication and checkout rules. The PDF's leaf logo, cosmetic/phone examples, ratings, and unenabled payment methods are not real store data and were not introduced.

## Artwork provenance

Built-in image_gen was used for a decorative background (not catalog photography).
Saved project asset: `public/assets/hero-reference-v2.webp` (2095 x 751; approximately 158 KB).
The same asset supplies the category heading and the campaign atmosphere.

Final generation prompt:

> Create a premium photographic website background asset matching the art direction of the attached reference board's desktop hero. This is decorative brand atmosphere, NOT a product catalog image. Ultra-wide horizontal 3.4:1 composition. Warm ivory limestone plaster wall and pale travertine plinth, elegant natural olive/ficus leaves at far right and subtle bottom-left edge, a large plain deep dark teal gift box tied with thin muted champagne-gold ribbon on the RIGHT THIRD, small ivory sculptural stone sphere and smaller plain ivory gift box beside it. Soft warm daylight, luxurious quiet editorial still life, authentic photographic materials, restrained brushed gold, no glossy CGI. LEFT 60 percent is empty softly lit ivory plaster for HTML text. All objects remain on RIGHT, no central obstruction. NO cosmetics, NO bottles, NO electronic devices, NO sale products, NO text, NO letters, NO numerals, NO logos, NO watermarks, NO UI. The attached full board is only a style/composition reference; output ONLY the standalone photographic background, no board or device frames.

## Verification

- Production build and TypeScript passed.
- ESLint passed for changed components.
- Home checked at widths 320, 390, 768, 1024 and 1440 with no document overflow.
- Catalog category selection verified in browser; the category tiles use the same slug conversion as the existing filter controls.
- Official logo and real catalog images intentionally differ from illustrative PDF board assets.

Implementation stylesheet: `src/app/reference-design.css`.
