# Partner homepage images

Generated using the built-in `image_gen` tool, based on the supplied partner landing-page composition. Existing Immify immigration and education context was retained. Only photographs were generated; all navigation, text, icons and cards are native UI. The header uses the original `src/images/immify-logo.png` asset and the same crop as the main header.

Saved assets:

- `public/images/partner/partner-hero.webp`
- `public/images/partner/partner-institutions.webp`

Each photograph was inspected and encoded with Sharp as WebP quality 87, up to 1440 pixels wide. Existing images `public/images/home/immify-agents.webp` and `public/images/home/immify-customers.webp` were reused for partner category cards.

## Generation prompts

### hero

Use case: photorealistic-natural. Asset: Immify partner portal hero photo, landscape 4:3. A friendly confident Indian male immigration and education business advisor in his early thirties, navy tailored suit and pale blue open-collar shirt, no tie, arms comfortably folded, smiling naturally at the camera. Subject on the RIGHT half of frame, shown from head to waist, whole head inside frame with generous space above and around shoulders. A contemporary international university campus with white modern architecture, green landscaped grounds and bright blue sky behind him, softly blurred. Premium authentic business editorial photography, natural daylight, realistic skin and hands, blue and white palette. Generous image area to left for a small floating UI benefits panel added separately. Reference screenshot informs visual composition only. No real estate branding, no text, no UI, no logos, no watermark, no rounded borders.

### institutions

Use case: photorealistic-natural. Asset: partner portal university institutions card and closing banner photo. Beautiful contemporary international university campus with pale stone and glass academic buildings, mature trees and landscaped green lawns, welcoming clear blue morning sky, a few tiny adult students in the far background. Professional editorial architectural photograph, natural realistic colors, blue-white-green palette, wide landscape 3:2. Compose main academic building toward left, leave pleasant greenery and sky to right. No text, no signage, no logos, no UI, no watermarks.

