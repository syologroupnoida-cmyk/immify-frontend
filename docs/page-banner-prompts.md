# Immify page banner prompts

Generated using the built-in image_gen tool. These are illustrative website images, not photographs of actual Immify staff or customers.

## Shared prompt specification

Use case: photorealistic-natural. Asset: panoramic 3:1 website banner for the corresponding Immify global mobility page. Premium contemporary editorial photography, realistic natural daylight, navy and muted blue accents, approachable professional mood. Main subjects on the right with uncluttered space on the left for an HTML heading; composition must survive responsive wide-banner cropping. No text, logos, brands, watermarks, flags, approval stamps or invented credentials.

## Page scene prompts

- **about.webp:** Diverse Indian and international professionals collaborating at a modern travel consultancy with a global skyline through the windows.
- **contact.webp:** a friendly Indian support professional in a modern consultation office, listening at a desk, laptop and notebook, approachable and calm
- **faq.webp:** a helpful consultation in a modern international education office, advisor explaining a plan to a young adult with a notebook, thoughtful and reassuring
- **become-a-provider.webp:** a small Indian consultancy business team planning together around a laptop in a contemporary office, professional collaboration, business growth through service
- **free-eligibility-check.webp:** an Indian young professional reviewing a blank application checklist and travel planning materials with an advisor, neutral passport closed with no markings, thoughtful preparation
- **be-a-global-indian.webp:** Indian students and young professionals chatting on an international city riverside promenade, diverse modern skyline, warm sense of community and international belonging
- **success-stories.webp:** a candid warm scene of an Indian student and young professional sharing travel experiences in a bright urban cafe overlooking an international skyline, authentic human connection, no implied visa approval or celebration of legal outcome
- **news.webp:** an elegant editorial desk with open laptop showing an entirely abstract unlettered screen, folded blank newspaper, globe and notebook beside an office window facing international skyline, factual journalistic mood
- **blog.webp:** a thoughtful Indian student reading a guide and writing notes in a bright contemporary library, global education research and planning, editorial photography
- **legal.webp:** an understated professional desk with neatly arranged unlettered documents, pen, closed navy folder and reading glasses in a modern consultancy office, careful review and transparency, no judge or government seals
- **services.webp:** an international mobility consultation office with a diverse group of Indian and international adults discussing study, travel and relocation plans beside a large window overlooking a modern skyline, clear approachable service discovery
- **providers.webp:** Professional Indian immigration and overseas education advisors collaborating in a bright contemporary consultation office, welcoming clients, service directory theme.
- **pricing.webp:** A small Indian consultancy business owner comparing unlettered documents and laptop screen with a colleague in a modern office; business planning and subscription selection.

## Saved assets

All 13 optimized banners are stored in `public/images/page-banners/<page>.webp`, at up to 1920 pixels wide. Original generated files remain in the generation tool's output directory. WebP encoding uses quality 84. The shared PortalHero uses a full-width background photograph with a dark overlay and centered HTML title. All banners are 240px high on tablet/desktop and 300px on mobile. The photograph uses responsive cover sizing with a focal point toward the people on the right.


## Full-width replacement banners

The current portal uses the 13 new photographs in `public/images/page-banners/full-width/`. Earlier assets above are retained as originals. The replacement compositions have subjects and environmental detail across the whole width, with no blank left area for copy. Centered HTML headings sit over an even translucent overlay; photographs use centered cover sizing at the same banner heights. Privacy Policy shares the legal image; Premium Services and service detail pages share the services image. The footer uses the exact header logo asset and crop, without adjacent brand text.

Generated with the built-in image_gen tool. The exact prompt for every replacement and its saved asset path are recorded in [page-banner-prompts-full-width.json](./page-banner-prompts-full-width.json). WebP export preserves the whole generated photograph at up to 1920px width, quality 84.

Scene-specific focal points keep the main faces visible in the shallow desktop crop. The selected Blog and Become a Provider images use `-v2` filenames after a composition review; their first variants are retained but unused. The prompt manifest lists only the 13 selected assets.
