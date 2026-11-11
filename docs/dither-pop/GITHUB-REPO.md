# GitHub Repo

系列视觉规范见 [DITHER-POP.md](DITHER-POP.md)。分类为 `dither-pop`。

Published 2026-11-11. Category: Dither Pop (`dither-pop`). Design style: Dither Pop.

## Component

`registry/github-repo.tsx` exports `GithubRepo` and `GithubRepoProps`. React only, with no npm dependencies, external assets or website references. The vector Octocat badge, deterministic radial halftone and layered contact shadows are inline SVG and scoped CSS; IDs are unique per instance.

The card is a display component: a blue clasp anchors the top, the badge sits beside the repository heading, and the warm halftone star button plus fork chip form the actions row. The housing stays assembled while pointer movement tilts the card a few degrees; touch input and reduced motion keep it static.

## API and behavior

- `owner`, `name`: required repository owner and name. Both are URL-encoded into `https://github.com/<owner>/<name>` links.
- `description`: optional repository description.
- `stars`, `forks`: counts supplied by the caller, default 0. Non-finite or negative values are clamped and formatted with `toLocaleString`.
- `visibility`: label chip, default `Public`.
- `starsLabel`, `forksLabel`: custom captions, default `stars` / `forks`.
- `className`: additional outer container classes.

The component does not request the GitHub API. Star and fork controls link to the repository; starring and authentication happen on GitHub. Preview copy prompt and example counts belong to the website preview only.

## Files

- Source: [github-repo.tsx](../../registry/github-repo.tsx)
- Preview: [github-repo-preview.tsx](../../src/components/previews/github-repo-preview.tsx)
- Page: `/components/github-repo`
