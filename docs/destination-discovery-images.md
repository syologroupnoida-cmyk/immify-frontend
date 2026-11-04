# Destination discovery images

Generated using the built-in `image_gen` tool. The supplied wedding website references informed the image-led layout; these photographs depict Immify's featured country destinations.

Saved assets:

- `public/images/countries/destination-canada.webp`
- `public/images/countries/destination-australia.webp`
- `public/images/countries/destination-united-states.webp`
- `public/images/countries/destination-united-kingdom.webp`

The generated four-panel image was split into quarters with a three-pixel inset per edge, then encoded with Sharp at WebP quality 87. Used on the homepage, `/destinations`, and the matching `/countries/[slug]` pages.

## Generation prompt

## Additional international destination images

Generated with the built-in `image_gen` tool for the International directory. The six-panel output was split into two columns and three rows with a three-pixel inset on each edge, then encoded with Sharp at WebP quality 87.

- `public/images/countries/destination-new-zealand.webp`
- `public/images/countries/destination-germany.webp`
- `public/images/countries/destination-uae.webp`
- `public/images/countries/destination-singapore.webp`
- `public/images/countries/destination-ireland.webp`
- `public/images/countries/destination-france.webp`

Additional generation prompt:

Use case: photorealistic-natural. Asset: six separate destination travel photographs for Immify. Generate one precise regular 2-column by 3-row grid of six equal landscape 3:2 panels, overall image square. Edge-to-edge panels, no gutters. Panel row1 left: New Zealand, Queenstown lake and Southern Alps. Row1 right: Germany, Berlin Brandenburg Gate in warm daylight. Row2 left: UAE, Dubai skyline and Burj Khalifa with waterfront. Row2 right: Singapore Marina Bay with Marina Bay Sands skyline in daylight. Row3 left: Ireland, Dublin River Liffey and Ha'penny Bridge with historic buildings. Row3 right: France, Paris Eiffel Tower and Seine with leafy riverbanks. Distinct recognizable place in each panel, inviting realistic editorial travel photography, natural blue skies and warm sunlight, clear detail. No text, no labels, no logos, no watermarks, no borders or overlays. Each panel will be cropped out individually for country image cards and hero banners.

Original four-country generation prompt:

Use case: photorealistic-natural. Asset: four photographic country destination images for an immigration website. Generate a clean precisely aligned 2 by 2 grid of four equally sized landscape photographs, all panels edge-to-edge, no gaps or borders. Top left: Toronto Canada skyline with CN Tower across blue lake water, warm golden morning. Top right: Sydney Australia harbour showing Opera House and Harbour Bridge on a clear blue day. Bottom left: New York United States skyline with Statue of Liberty visible, warm afternoon. Bottom right: London United Kingdom Westminster Palace and Big Ben along River Thames with Westminster Bridge, soft sunny day. Every panel an inviting realistic editorial travel photograph, distinct recognizable landmark, natural colors, high detail. Overall image landscape aspect ratio 3:2 so each quarter also landscape 3:2. No text, no country labels, no typography, no collage overlaps, no logos, no watermarks, no UI. Each panel will be extracted into a separate image for clickable destination cards and country detail hero banners.
