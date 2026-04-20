# Task 0001 — Rename and move repository to open-aviation-solutions org

**Status:** Pending

## Goal

Rename this repository (and the published package) from `aviation-learning-components` to `open-aviation-components`, and move it from the personal `absoludity` account to the new `open-aviation-solutions` GitHub organisation. The new name:

- Drops the "learning" qualifier — the components are useful for teaching *and* for self-study, reference, and potentially tools beyond training.
- Makes the "open" positioning explicit, reinforcing the MPL-2.0 licensing and the invitation to fork and contribute.

The move to an organisation signals that this is a shared, community-oriented project rather than a personal one, and groups it alongside any future related projects under the same umbrella.

Both the rename and the org move should happen before the package is published to npm, so there's no churn for external consumers.

## Context

The repository currently:

- Lives at `github.com/absoludity/aviation-learning-components`.
- Deploys its demo to `absoludity.github.io/aviation-learning-components/`.
- Has `name: "aviation-learning-components"` in `package.json` (not yet published to npm).
- Uses `base: '/aviation-learning-components/'` in `vite.config.js` so asset paths work under the GitHub Pages sub-path.

After this task it will:

- Live at `github.com/open-aviation-solutions/open-aviation-components`.
- Deploy its demo to `open-aviation-solutions.github.io/open-aviation-components/`.

## Steps

1. [ ] Create the `open-aviation-solutions` GitHub organisation (if it doesn't already exist). The free tier is fine — public repos only is the intended model.
2. [ ] Rename the GitHub repository: `aviation-learning-components` → `open-aviation-components`. GitHub auto-redirects the old URL, so existing clones and links keep working.
3. [ ] Transfer the repository from `absoludity` to the `open-aviation-solutions` organisation via GitHub's "Transfer ownership" flow (Settings → General → Danger Zone). GitHub sets up a redirect from the old owner/name path as well.
4. [ ] Update the local git remote:
   ```bash
   git remote set-url origin git@github.com:open-aviation-solutions/open-aviation-components.git
   ```
5. [ ] The local working directory has already been moved to `~/dev/open-aviation-solutions/aviation-learning-components/`. Rename the leaf directory to match the new repo name: `aviation-learning-components` → `open-aviation-components`, so the full path becomes `~/dev/open-aviation-solutions/open-aviation-components/`.
6. [ ] Update `package.json`:
   - `name`: `aviation-learning-components` → `open-aviation-components` (or a scoped name like `@open-aviation-solutions/components` if publishing under an npm org — decide before first publish).
   - `repository.url`: update to `https://github.com/open-aviation-solutions/open-aviation-components`.
7. [ ] Update `vite.config.js`: change `base: '/aviation-learning-components/'` to `base: '/open-aviation-components/'`. The base path stays as the repo name (not the org), because GitHub Pages for a project repo serves under `<org>.github.io/<repo>/`.
8. [ ] Update `README.md`:
   - Title and all mentions of the old name.
   - Live demo URL: `https://open-aviation-solutions.github.io/open-aviation-components/`.
   - Import example — the current README still shows the stale Vue SFC pattern (`import FourForces from 'aviation-learning-components/src/components/FourForces.vue'`). The components are already custom elements; rewrite the usage section to show `import 'open-aviation-components'` and `<four-forces>` HTML usage, matching the actual architecture described in `CLAUDE.md`.
9. [ ] Update `CLAUDE.md`: replace all references to the old name, including the `npm run dev` URL comment and the deployed demo URL.
10. [ ] Search for any remaining references to the old name and the old owner:
    ```bash
    rg -i 'aviation-learning-components'
    rg -i 'absoludity\.github\.io'
    ```
    Update any hits (source comments, demo code, LICENSE header if present, etc.).
11. [ ] Re-enable and verify GitHub Pages under the new organisation:
    - In the new repo's Settings → Pages, confirm the source is set to the same branch/path as before (typically `gh-pages` branch or "GitHub Actions").
    - If deployment uses a GitHub Actions workflow (`.github/workflows/*.yml`), check that the workflow still has the permissions it needs under the org. Organisation-level Actions settings can be stricter than personal — in particular, confirm "Workflow permissions" allows `GITHUB_TOKEN` write access for Pages, and that the org allows the workflow to run.
    - Trigger a fresh deploy (push a trivial commit or re-run the latest workflow) and confirm the site is served at `https://open-aviation-solutions.github.io/open-aviation-components/`.
    - Verify asset paths load correctly (the updated Vite `base` is critical here — a mismatch will 404 all JS/CSS).
12. [ ] Commit the rename as a single logical change with a clear message, and push to the new remote.
13. [ ] (Later — separate task) Publish the first version to npm under the new name.

## Notes

- GitHub's redirects from both the old repo URL *and* the old owner path are convenient but not a reason to delay — the sooner the canonical name is right, the fewer stale links accumulate.
- Transferring a repo preserves issues, PRs, stars, watchers, and git history. Release artefacts tied to the old owner's Pages URL (e.g. anyone who bookmarked the demo) will redirect, but embeds that pin the URL in iframes may need manual updates.
- If scoping under an npm organisation, create the npm org *before* the first publish; once a package name is taken, moving it is painful. An npm org named `open-aviation-solutions` that mirrors the GitHub org is the natural choice.
- The package is not yet on npm, so there are no existing installs to migrate. This is the cheapest possible moment to rename.
- Do the rename and the transfer in that order (rename first, then transfer). Transferring first and then renaming also works but produces an extra redirect hop.
