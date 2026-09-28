# Publish to GitHub Pages

Repository: https://github.com/Amjuks/Portfolio  
Website: https://amjuks.github.io/Portfolio/

## 1. Check the site locally

Use Node 22.19 or newer in the Node 22 release line. From the repository folder:

```sh
npm ci
npm run build
npx playwright install chromium
npm test
npm run preview
```

Open http://localhost:4321/Portfolio/. Check project drawers, images, certificates, and mobile layout. Stop the preview with Ctrl+C.

To run the browser tests against the optimized build in PowerShell:

```powershell
$env:TEST_PRODUCTION = '1'
npm test
Remove-Item Env:TEST_PRODUCTION
```

Port 4321 must be free before this test starts. On macOS/Linux, use `TEST_PRODUCTION=1 npm test`.

## 2. Enable GitHub Pages

1. Open [the repository's Pages settings](https://github.com/Amjuks/Portfolio/settings/pages).
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Keep the existing `.github/workflows/deploy.yml`; no additional starter workflow is needed.
4. Leave **Custom domain** empty for the URL above.
5. Open [Settings → Environments](https://github.com/Amjuks/Portfolio/settings/environments) and select **github-pages**. Under **Deployment branches and tags**, select **Selected branches and tags** and add a **Branch** rule with the exact name **master**. Keep any required reviewers or other protection rules in place. The workflow trigger and environment allowlist must both permit this branch.

You need repository administrator access for these settings. This setup follows [GitHub's custom-workflow instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 3. Commit and push

The workspace already has `origin` set to `https://github.com/Amjuks/Portfolio.git`. Verify before pushing:

```sh
git remote -v
git branch --show-current
git status
git add .
git diff --cached --stat
git commit -m "Prepare portfolio for GitHub Pages"
git push origin master
```

These commands assume you are on `master`. If you work on another branch, push that branch and merge its pull request into `master`. Review staged changes before committing. Commit `package-lock.json`, source code, JSON content, and files under `public/`. Generated `dist/`, dependencies, and test screenshots are ignored.

No personal access token, API key, or deployment secret is required by the workflow; it uses GitHub's built-in token.

## 4. Watch the deployment

Open [Actions](https://github.com/Amjuks/Portfolio/actions), then **Deploy portfolio to GitHub Pages**.

The workflow installs locked dependencies, builds the site, optimizes image previews, runs browser tests against production output, uploads `dist/`, and deploys it. A failed build or test prevents deployment.

After both jobs succeed, open https://amjuks.github.io/Portfolio/. You can also rerun from **Actions → Deploy portfolio to GitHub Pages → Run workflow → master**.

## 5. Publish later changes

Edit `portfolio_data.json` and add assets under `public/`, run the local checks, then commit and push to `master`. Each push triggers the same pipeline. No manual copying of `dist/` or `gh-pages` branch is needed.

## Production behavior

- Static HTML, compressed markup, bundled CSS/JavaScript, and locally hosted fonts; no server or client framework is required.
- Build-time WebP previews for larger PNG/JPEG images, capped at 1600 pixels with no upscaling. Smaller conversions are used automatically. Original files remain available for full-resolution enlargement. JSON and source images are untouched.
- Images below the introduction load lazily; videos preload no data; YouTube loads only after Play.
- Animated GIFs stay animated and are not converted. For large animations, an MP4 with a still poster is usually more economical.
- Preview filenames include content hashes. Astro also fingerprints bundled assets.
- GitHub caches npm downloads between builds. Remote screenshot capture never runs during deployment.
- Site origin and the case-sensitive `/Portfolio/` base path come from Pages metadata. Local builds use `contact.portfolio` in the JSON.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| No workflow runs | The commit must contain the workflow and land on `master`; Actions must be enabled. |
| Branch master is not allowed to deploy | In Settings → Environments → github-pages, add a Branch rule for master under Selected branches and tags, then rerun the failed deployment. Editing the workflow alone does not change this repository setting. |
| Pages setup or deployment denied | Select GitHub Actions in Pages settings; check repository Actions permissions and any `github-pages` environment branch restrictions. |
| Build fails | Open the failed step. Unknown project/category references must exactly match names in the JSON. |
| Image missing | Confirm it is committed under `public/` and the JSON path has matching capitalization. Linux paths are case-sensitive. |
| CSS or images 404 | Keep `contact.portfolio` set to the website above. Do not prepend `public/` or duplicate `Portfolio/` in asset paths. |
| Production tests cannot start locally | Stop the dev/preview server using port 4321. |
| Old content | Confirm the latest workflow succeeded; refresh the page after deployment. |

To roll back, revert the relevant commit and push the revert to `master`.

### Windows native-binding error

If Astro reports a missing Rolldown native binding, stop the running server and run:

```sh
npm run repair:deps
npm run preview
```

The repair command uses the project-local Node runtime to reinstall optional dependencies while keeping the lockfile. This workspace's system Node 22.2.0 is too old for the installed build tools; the project-local Node is newer. For clean installs on another machine, install Node 22.19 or newer in the Node 22 line before running `npm ci`. Avoid installing with `--omit=optional`.

You do not need to delete `package-lock.json` for this case: it already lists the native packages for Windows and Linux.
