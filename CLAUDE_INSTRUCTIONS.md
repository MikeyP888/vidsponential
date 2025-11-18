# Claude Code Instructions

## Git Workflow
- Always checkout and work on the `main` branch locally
- Commit changes to local `main` with clear, descriptive commit messages
- Push to feature branch (Claude will use `claude/*` branches automatically)
- Merge feature branch to `main` via GitHub PR to deploy

## Commands to use:
```bash
git checkout main
git pull --rebase origin main
# make changes
git add .
git commit -m "descriptive message"
git push origin HEAD:claude/<branch-name>  # Claude handles this automatically
```

## Deployment
- Merge PR to `main` on GitHub
- Vercel auto-deploys from `main` branch
- Changes appear live at https://vidsponential.com in ~30 seconds after merge

## URLs
- Landing page: https://vidsponential.com/
- Dashboard: https://vidsponential.com/dashboard
