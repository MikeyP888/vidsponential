# Claude Code Instructions

## Git Workflow
- Always checkout and work directly on the `main` branch
- Do NOT create feature branches
- Push changes directly to `main` after committing
- Use clear, descriptive commit messages

## Commands to use:
```bash
git checkout main
git pull origin main
# make changes
git add .
git commit -m "descriptive message"
git push origin main
```

## Deployment
- Vercel auto-deploys from `main` branch
- Changes appear live in ~30 seconds after push
