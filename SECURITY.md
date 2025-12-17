# Security Policy

## 🔐 API Key Security

### Protecting Your API Key

1. **Never commit API keys to Git**
   - Always use `.env.local` for local development
   - Verify `.env` and `.env.local` are in `.gitignore`
   - Use environment variables on hosting platforms

2. **Server-side only**
   - API keys are only available on the server
   - Never prefix with `NEXT_PUBLIC_` which exposes to client
   - Client-side code cannot access `process.env.API_KEY`

3. **Rotate regularly**
   - Change API keys every 90 days or when team members leave
   - Contact backend team for key rotation
   - Update all environments after rotation

4. **Monitor usage**
   - Review API usage logs regularly
   - Report suspicious activity to backend team
   - Set up alerts for rate limit violations

### What to Do If Your Key Is Compromised

If you suspect your API key has been exposed:

1. **Immediately notify the backend team**
   - Email or message them with urgency
   - Request immediate key revocation

2. **Rotate the key**
   - Obtain a new API key
   - Update local `.env.local` 
   - Update production environment variables

3. **Audit your code**
   - Check Git history for accidental commits
   - Review all places where key might be exposed
   - Use `git log -S "API_KEY"` to search history

4. **Prevention**
   - Enable pre-commit hooks to scan for secrets
   - Use tools like `git-secrets` or `detect-secrets`
   - Review PRs carefully before merging

## 🛡️ Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability
4. Wait for confirmation before disclosing publicly

## 🔒 Best Practices for Developers

### Local Development

```bash
# ✅ GOOD: Use environment variables
const apiKey = process.env.API_KEY;

# ❌ BAD: Hardcode API key
const apiKey = "sk_1234567890abcdef";
```

### Code Reviews

- [ ] Verify no API keys in code
- [ ] Check `.env` files are gitignored
- [ ] Ensure API calls are server-side only
- [ ] Validate error handling for auth failures

### Deployment

- [ ] Verify environment variables are set on hosting platform
- [ ] Test API authentication in production
- [ ] Monitor for authentication errors
- [ ] Set up logging and alerting

## 📞 Contact

For security concerns, contact:
- Backend Team: [repository](https://github.com/Tornike512/sales-backend-python)
- Security Email: [To be provided]

## 📋 Security Checklist

- [ ] API key stored in `.env.local`
- [ ] `.env.local` in `.gitignore`
- [ ] No API keys in code or commits
- [ ] Server-side API calls only
- [ ] Production environment variables configured
- [ ] Error handling for 403/429 responses
- [ ] Rate limiting respected
- [ ] CORS properly configured
- [ ] Regular key rotation scheduled
- [ ] Team trained on security practices
