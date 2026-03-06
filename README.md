# create-b24-app

CLI initializer for creating Bitrix24 applications.

Run:

```bash
npm create b24-app
```

or

```bash
npx create-b24-app
```

You can pass the project directory directly:

```bash
npm create b24-app my-app
```

---

## Table of Contents

1. [What is this tool](#what-is-this-tool)
2. [How npm create works](#how-npm-create-works)
3. [Project architecture](#project-architecture)
4. [How the build works (tsup + TypeScript)](#how-the-build-works-tsup--typescript)
5. [How to run the CLI locally](#how-to-run-the-cli-locally)
6. [How to build the CLI](#how-to-build-the-cli)
7. [How to publish the CLI to npm](#how-to-publish-the-cli-to-npm)
8. [How to add a new template](#how-to-add-a-new-template)
9. [How template mapping works](#how-template-mapping-works)
10. [Maintenance and versioning](#maintenance-and-versioning)

---

## What is this tool

`create-b24-app` is a CLI tool for quickly scaffolding new Bitrix24 application projects.

The architecture follows [Docus CLI](https://github.com/nuxt-content/docus/tree/main/cli):

- **citty** — CLI command definition
- **tsup** — bundling into a single output file
- **tsx** — running TypeScript in dev mode
- **@nuxt/cli** — downloading templates from GitHub (via giget)
- **@clack/prompts** — interactive prompts (instead of CLI args)

When you run the CLI:

1. It asks interactive questions about the application type
2. Resolves the template based on your answers
3. Downloads the template from GitHub via `@nuxt/cli`
4. Prints instructions to get started

---

## How npm create works

When you run:

```bash
npm create b24-app
```

npm automatically prepends `create-` and runs the `create-b24-app` package.

In `cli/package.json`:

```json
{
  "bin": {
    "create-b24-app": "dist/main.js"
  }
}
```

`tsup` adds the shebang `#!/usr/bin/env node` to the output file during build.

---

## Project architecture

### pnpm workspace monorepo

The project is organized as a pnpm workspace with two packages:

```
create-b24-app/
├── package.json               # Workspace root (private)
├── pnpm-workspace.yaml        # Workspace config
│
├── cli/                       # CLI package (published to npm)
│   ├── package.json           # name: create-b24-app
│   ├── tsup.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts            # Entry point
│       ├── cli.ts             # citty defineCommand + @nuxt/cli
│       ├── questions.ts       # @clack/prompts
│       ├── resolveTemplate.ts # Template mapping
│       ├── printNextSteps.ts  # Post-create instructions
│       └── types.ts           # TypeScript types
│
└── .starters/                 # Project templates (on GitHub)
    ├── starter/               # Base template
    └── dashboard/             # Extended template
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'cli'
  - '.starters/*'
```

### How the CLI downloads templates

The CLI uses `@nuxt/cli` to download templates from GitHub:

```typescript
const { runCommand } = await import('@nuxt/cli')
await runCommand('init', [dir, '-t', `gh:${repo}/.starters/${starter}`])
```

---

## How the build works (tsup + TypeScript)

### tsup

Configuration in `cli/tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  noExternal: ['@clack/prompts'],
  external: ['@nuxt/cli'],
})
```

- **noExternal: ['@clack/prompts']** — bundles `@clack/prompts` into the output
- **external: ['@nuxt/cli']** — keeps `@nuxt/cli` as an external dependency (too large to bundle)

---

## How to run the CLI locally

### Dev mode (tsx)

```bash
pnpm run dev
# or from root:
pnpm --filter create-b24-app dev
```

### Via npm link

```bash
cd cli
pnpm run build
npm link

# CLI is now available globally
create-b24-app
```

### Direct run

```bash
pnpm run build
node cli/dist/main.js
```

---

## How to build the CLI

```bash
# From monorepo root
pnpm run build

# Or directly
cd cli && pnpm run build
```

Output: `cli/dist/main.js` (~50 KB).

---

## How to publish the CLI to npm

### Authentication

```bash
npm login
```

### Publish

```bash
cd cli
pnpm run build
npm publish --access public
```

### Dry run before publishing

```bash
cd cli
npm pack --dry-run
```

---

## Semantic versioning

Format: **MAJOR.MINOR.PATCH** (e.g. `1.2.3`):

- **MAJOR** — breaking changes (removing templates, changing questions)
- **MINOR** — new features (new templates, new questions)
- **PATCH** — bug fixes

```bash
cd cli
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0
npm publish
```

---

## How to add a new template

### Step 1: Create the directory

```bash
mkdir .starters/my-new-template
```

### Step 2: Add project files

Place the template files in the directory. The template must be a standalone project with `package.json`.

### Step 3: Update types

In `cli/src/types.ts`:

```typescript
export type StarterName = 'starter' | 'dashboard' | 'my-new-template'
```

### Step 4: Update the mapping

In `cli/src/resolveTemplate.ts`:

```typescript
const TEMPLATE_MAP: Record<TemplateId, StarterName> = {
  // ... existing entries
  'some-new-id': 'my-new-template',
}
```

### Step 5: Rebuild and publish the CLI

```bash
pnpm run build
cd cli && npm version minor && npm publish
```

---

## How template mapping works

The identifier is built from your answers: **platform** + **distribution type**.

| Platform | Distribution | Identifier       | Template   |
| -------- | ------------ | ---------------- | ---------- |
| Desktop  | Local        | `desktop-local`  | `starter`  |
| Desktop  | Market       | `desktop-market` | `dashboard`|
| Mobile   | Local        | `mobile-local`   | `starter`  |
| Mobile   | Market       | `mobile-market`  | `dashboard`|
| Universal| Local        | `universal-local`| `starter`  |
| Universal| Market       | `universal-market`| `dashboard`|

Configuration in `cli/src/resolveTemplate.ts`:

Principle: local applications → `starter`, marketplace → `dashboard`.

---

## Maintenance and versioning

### Workflow

1. **Development** — changes in `cli/src/` and `.starters/`
2. **Dev** — `pnpm run dev`
3. **Build** — `pnpm run build`
4. **Verify** — `node cli/dist/main.js`
5. **Publish** — `cd cli && npm publish`

---

## Dependencies

| Package           | Type   | Purpose                              |
| ----------------- | ------ | ------------------------------------ |
| `@clack/prompts`  | runtime| Interactive prompts                  |
| `@nuxt/cli`       | runtime| Download templates from GitHub (giget)|
| `citty`           | runtime| CLI commands (like Docus)             |
| `tsup`            | dev    | Bundle into single file               |
| `tsx`             | dev    | Run TypeScript without compilation    |
| `typescript`      | dev    | Type checking                         |
| `@types/node`     | dev    | TypeScript types for Node.js          |
