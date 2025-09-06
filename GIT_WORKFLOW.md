# Vidsponential Git Workflow Guide

## Branching Strategy

### Main Branches:
- `main` - Production ready code (auto-deploys to Vercel)
- `development` - Integration branch for new features
- `backup/YYYY-MM-DD` - Backup branches for major changes

### Feature Branches:
- `feature/homepage-update`
- `feature/script-editor-fix`
- `hotfix/critical-bug-name`

## Versioning System

### Version Tags:
- `v1.0.0` - Major releases
- `v1.1.0` - Minor feature additions  
- `v1.1.1` - Bug fixes and patches

### Creating a Version:
```bash
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0
```

## Pre-Change Backup Process:

### Before Making Major Changes:
1. Create backup branch: `git checkout -b backup/$(date +%Y-%m-%d)`
2. Push backup: `git push origin backup/$(date +%Y-%m-%d)`
3. Return to main: `git checkout main`
4. Create feature branch: `git checkout -b feature/your-change-name`

### Daily Backup Commands:
```bash
# Quick backup before starting work
git checkout -b backup/$(date +%Y-%m-%d)
git push origin backup/$(date +%Y-%m-%d)
git checkout main
```

## Current Issues & Plan:

### 1. Home Page Issue:
- ✅ Current Vercel version backed up to `/backups/index_vercel_current.html`
- 🔄 Need to replace local index.html with Vercel version
- 🔄 Then sync to GitHub

### 2. script_visuals_editor.html Issue:
- ❌ Returns 404 on Vercel (file missing or broken)
- ✅ Have backup version in local files
- 🔄 Need to determine which version to use

### 3. Portfolio Issue:
- ✅ Working fine on Vercel - no action needed

## Emergency Recovery:
If anything goes wrong, you can always:
1. Check backup branches: `git branch -r | grep backup`
2. Restore from backup: `git checkout backup/YYYY-MM-DD`
3. Copy files to main: `git checkout main && git checkout backup/YYYY-MM-DD -- filename.html`
