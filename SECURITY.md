# Security Guidelines for Aadinath Industries Website

## 🔒 Critical: Never Commit Secrets

### What NOT to Commit to Git
- Firebase API keys / config
- Database credentials
- Private tokens or API keys
- `.env` files with secrets
- SSH keys
- AWS credentials

### What IS Safe to Commit
- `.env.example` (template only, no real values)
- Public configuration
- Code comments
- Documentation

---

## Environment Variables Setup

### Local Development

Create `.env.local` in the project root:
```bash
# .env.local (NEVER commit this)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# ... etc
```

**Important:** `.env.local` is in `.gitignore` and will NOT be committed.

### Production (Vercel)

1. Go to **Vercel Dashboard** → Select `aadinathindustries.in` project
2. Go to **Settings** → **Environment Variables**
3. Add each variable:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - etc.

**Note:** On Vercel, use `NEXT_PUBLIC_*` prefix for client-side variables (they're safe to expose in browser).

---

## Security Issue: Exposed Credentials in Git History

### Issue
Previous commits (e9dde95, 13ec800) contain Firebase credentials in plain text.

### Status
- ✅ Fixed in current code (using environment variables)
- ⚠️ Still exposed in git history
- ⚠️ Public repository = visible to anyone

### What to Do
1. **Rotate Firebase keys** immediately
   - Go to Firebase Console → Project Settings
   - Regenerate Web API Key
   - Update all environment variables (local + Vercel)

2. **Invalidate old credentials** (if possible in Firebase)

3. **Optional: Rewrite git history** (advanced)
   ```bash
   # NOT recommended unless absolutely necessary - risky operation
   # git filter-branch -f --index-filter 'git rm --cached -r --ignore-unmatch [files]'
   ```

4. **Monitor Firebase usage** for unauthorized access

---

## Best Practices

### ✅ DO

- ✅ Use environment variables for all secrets
- ✅ Prefix client-side variables with `NEXT_PUBLIC_`
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Review `.gitignore` before committing
- ✅ Use `.env.example` as a template
- ✅ Rotate keys regularly
- ✅ Monitor Firebase for suspicious activity

### ❌ DON'T

- ❌ Hardcode API keys in source files
- ❌ Commit `.env.local` to git
- ❌ Share credentials via Slack/Email
- ❌ Reuse keys across projects
- ❌ Log credentials to console in production

---

## File Checklist

Before every commit, verify:

```bash
# ✅ Should be committed
- lib/firebase.ts (using env vars, no secrets)
- .env.example (template, no real values)
- .gitignore (ignores secrets)
- SECURITY.md (this file)

# ❌ Should NEVER be committed
- .env.local (local secrets)
- .env.production.local
- Any file with "KEY", "SECRET", "CREDENTIAL"

# Check status before pushing
git status
git diff --cached  # Review what you're about to commit
```

---

## Vercel Deployment

After setting environment variables in Vercel:

1. **Trigger a redeploy:**
   - Go to Vercel Dashboard → Deployments
   - Click the latest deployment
   - Click "Redeploy"

2. **Test the site:**
   - Visit https://aadinathindustries.in/verify?batch=TEST
   - Check browser console for errors
   - Verify Firebase is connected (check Firestore in console.firebase.google.com)

3. **Monitor:**
   - Check Vercel logs for errors
   - Monitor Firebase for new `scan_events`

---

## Emergency Response

**If credentials are exposed:**
1. Immediately invalidate/rotate the keys in Firebase
2. Update all environment variables
3. Redeploy
4. Monitor Firebase for suspicious activity
5. Review git history for when exposure occurred

**If you accidentally commit secrets:**
1. Invalidate the credentials immediately
2. Remove from git history (git filter-branch or BFG)
3. Force push (⚠️ dangerous, coordinate with team)
4. Notify your team

---

## Helpful Links

- [Firebase Security Best Practices](https://firebase.google.com/docs/projects/learn-more#api-keys)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [OWASP Secrets Management](https://owasp.org/www-community/attacks/Secrets_Management)
- [Git Secrets Prevention](https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git)

---

## Contacts

**Security Concerns?** Report immediately to the team.
**Questions about credentials?** Ask before committing!

---

Last Updated: 2026-02-05
