# Publishing to NPM Guide

Follow these steps to publish your `@hisd3/sse-notifications-react` package to npm:

## Prerequisites

1. **Create an npm account** at [https://www.npmjs.com/signup](https://www.npmjs.com/signup) if you don't have one
2. **Verify your email** address in your npm account
3. **Set up 2FA** (Two-Factor Authentication) for your npm account (required for publishing)

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

Enter your npm username, password, and 2FA code when prompted.

### 2. Verify your login

```bash
npm whoami
```

This should display your npm username.

### 3. Run a final build

```bash
npm run build:lib
```

### 4. Test the package locally (optional but recommended)

```bash
# Pack the package to see what will be published
npm pack

# This creates a .tgz file - you can inspect its contents
tar -tf hisd3-sse-notifications-react-1.0.0.tgz
```

### 5. Publish to npm

```bash
npm publish
```

If this is your first time publishing a scoped package (`@hisd3/`), you might need to run:

```bash
npm publish --access public
```

### 6. Verify the package is published

Visit: https://www.npmjs.com/package/@hisd3/sse-notifications-react

Or check via CLI:
```bash
npm view @hisd3/sse-notifications-react
```

## Post-Publishing

### Install and test your package

```bash
# In a new project
npm install @hisd3/sse-notifications-react

# Test import
node -e "console.log(require('@hisd3/sse-notifications-react'))"
```

### Update version for future releases

```bash
# For bug fixes
npm version patch

# For new features
npm version minor

# For breaking changes
npm version major

# Then publish again
npm publish
```

## Troubleshooting

### Common Issues:

1. **403 Forbidden**: You don't have permission to publish under this scope
   - Solution: Change the package name or get permission for the `@hisd3` scope

2. **Version already exists**: The version number already exists
   - Solution: Update the version number in `package.json`

3. **Missing 2FA**: npm requires 2FA for publishing
   - Solution: Enable 2FA in your npm account settings

4. **Package name taken**: The package name is already in use
   - Solution: Choose a different package name

### Scope Management

If you own the `@hisd3` organization on npm:
- You can publish directly
- Make sure `publishConfig.access` is set to `"public"` in package.json

If you don't own the scope:
- Change the package name to something like `sse-notifications-react` (without the scope)
- Or create your own scope like `@yourusername/sse-notifications-react`

## Package.json Configuration

Your current package.json is already configured for publishing:

```json
{
  "name": "@hisd3/sse-notifications-react",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

This means the package will be:
- Published as a public package (anyone can install it)
- Published to the main npm registry

## Security Best Practices

1. **Use 2FA**: Always enable two-factor authentication
2. **Review files**: Check what files are being published with `npm pack`
3. **Use .npmignore**: Exclude unnecessary files from the package
4. **Version management**: Use semantic versioning (semver)
5. **Test before publishing**: Always test your package locally first

## Success!

Once published, developers can install your package with:

```bash
npm install @hisd3/sse-notifications-react
```

And use it in their React applications as shown in the README.md examples!