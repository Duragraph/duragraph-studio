# Branch Protection Configuration

This document outlines the recommended branch protection rules for the DuraGraph Studio repository.

## Recommended Branch Protection Settings

### For `main` branch:

1. **Require a pull request before merging**
   - ✅ Require approvals: **1**
   - ✅ Dismiss stale PR approvals when new commits are pushed
   - ✅ Require review from code owners (if CODEOWNERS file exists)

2. **Require status checks to pass before merging**
   - ✅ Require branches to be up to date before merging
   - **Required status checks:**
     - `Code Quality & Linting`
     - `TypeScript Type Check` 
     - `Build Application`
     - `Security Audit`
     - `All Checks Passed ✅`

3. **Require conversation resolution before merging**
   - ✅ Require conversation resolution before merging

4. **Require signed commits** (optional but recommended)
   - ✅ Require signed commits

5. **Include administrators**
   - ✅ Include administrators (enforce rules for admins too)

6. **Allow force pushes**
   - ❌ Do not allow force pushes

7. **Allow deletions**
   - ❌ Do not allow deletions

## How to Configure

### Via GitHub Web Interface:

1. Go to **Settings** → **Branches**
2. Click **Add rule** 
3. Set **Branch name pattern** to `main`
4. Configure the settings as outlined above
5. Click **Create**

### Via GitHub CLI:

```bash
# Enable branch protection for main
gh api repos/Duragraph/duragraph-studio/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Code Quality & Linting","TypeScript Type Check","Build Application","Security Audit","All Checks Passed ✅"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field required_conversation_resolution=true
```

## Status Check Names

Make sure these exact status check names are used in your branch protection rules:

- `Code Quality & Linting`
- `TypeScript Type Check`
- `Build Application` 
- `Security Audit`
- `All Checks Passed ✅`

## Auto-merge Configuration (Optional)

You can also enable auto-merge for dependabot PRs that pass all checks:

1. Go to **Settings** → **General**
2. Enable **Allow auto-merge**
3. Configure dependabot to auto-merge minor/patch updates

## Repository Settings

Additional recommended repository settings:

### General
- ✅ **Allow merge commits**
- ✅ **Allow squash merging** (recommended default)
- ❌ **Allow rebase merging** (optional)
- ✅ **Always suggest updating pull request branches**
- ✅ **Allow auto-merge**
- ✅ **Automatically delete head branches**

### Code Security
- ✅ **Dependency graph**
- ✅ **Dependabot alerts**  
- ✅ **Dependabot security updates**
- ✅ **CodeQL analysis**
- ✅ **Secret scanning**

This configuration ensures:
- ✅ All code is reviewed before merging
- ✅ CI checks must pass
- ✅ No broken code reaches main
- ✅ Security vulnerabilities are caught
- ✅ Code quality standards are maintained