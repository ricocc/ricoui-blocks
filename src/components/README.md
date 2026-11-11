# Components map

Keep the website and distributed components separate. Add a subfolder for an actual feature, not for every file type.

```text
src/components/
  site/
    home/
      home-page.tsx          Homepage section composition
      home-hero.tsx          Hero copy, actions, and landscape
      home-showcase.tsx      Curated component selection
      home-discovery.tsx     Theme-aware discovery banner
      home-process.tsx       Usage steps and their reveal animation
      home-faq.tsx           FAQ section
      home-night.tsx         Independent night scene and call to action
      home-content.ts        FAQ copy
      home.css               Homepage-only presentation
      halftone-landscape.tsx Interactive canvas and animation lifecycle
      landscape-geometry.ts Fixed terrain profiles and deterministic point generation
      drafting-overlay.tsx  Reference drawing frame and labels
    header.tsx              Shared persistent navigation
    site-footer.tsx         Reusable interactive footer, navigation, and legal links
    site-footer.css         Self-contained interactive footer styles
    tech-text.tsx           Website-only draggable text used by SiteFooter
    footer.tsx              Existing compact footer for other routes
    global-search.tsx       Search dialog and provider
    theme-toggle.tsx        Website theme
    browse-*.tsx            Infinite canvas and browse cards
    detail-*.tsx            Component detail workspace and installation
    component-*.tsx         Shared preview / catalog / documentation pieces
    showcase-card.tsx       Shared live-preview card (homepage, catalog, comparison)
    code-block.tsx          Source and usage rendering
    ...                     Other small shared website components
  previews/                 Website-only component demos and sample content
src/data/site-navigation.ts Shared header/footer links and copy
registry/                   Actual installable component source (outside src)
```

- Home-specific drawing code belongs in `site/home/`, never `registry/`.
- Shared cards and preview infrastructure stay directly in `site/` while the project is small.
- Preview imports are explicitly registered in `src/data/preview-registry.ts`.
- Keep imports direct; there is no barrel, auto-discovery, or component code generator.
- `/home` preserves the original comparison design; its shared styles remain in `src/styles.css`.

Homepage background images live in `public/images/home/`; the interactive hero remains code-rendered.

`site/home/scene-atmosphere.tsx` adds sparse decorative animation over background images, with visibility and reduced-motion handling.

`HomePage` composes the homepage sections and `SiteFooter`. Section spacing is controlled by `.collection-home.home-sheet` in `home.css` (96px desktop / 64px mobile); the footer uses the same spacing in `site-footer.css`. `SiteFooter` imports its own styles and text effect. Both footers use shared Privacy and MIT License destinations from `site-navigation.ts`; they retain the personal website credit and link to X. `SiteFooter` does not depend on homepage modules or styles.

Header, the interactive `SiteFooter`, and the compact `Footer` read navigation labels, destinations, and footer copy from `src/data/site-navigation.ts`.
