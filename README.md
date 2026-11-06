# api-spec-diff

[![CI](https://github.com/dani-s-h007/api-spec-diff/actions/workflows/ci.yml/badge.svg)](https://github.com/dani-s-h007/api-spec-diff/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](package.json)

> **OpenAPI & Swagger breaking change detector and backward compatibility auditor.**

Modifying REST APIs without strict breaking change detection frequently causes silent outages for mobile applications, microservices, and external API partners. An innocent change like adding a required query parameter or renaming an endpoint breaks consumers immediately. `api-spec-diff` compares two OpenAPI 3.0/3.1 specifications, categorizing modifications into Breaking and Non-Breaking changes for CI enforcement.

---

## Features

- **Breaking Change Detection**: Identifies removed paths, removed HTTP methods, and newly added required parameters.
- **Non-Breaking Evolution**: Categorizes backward-compatible additions (new endpoints, optional parameters).
- **CI / Pull Request Gatekeeper**: Exit with code 1 (`--strict`) to block PRs from merging breaking API regressions.
- **Zero Runtime Dependencies**: Ultra-fast execution with zero third-party dependencies.

---

## Installation & Demo

```bash
# Run on-demand with npx
npx api-spec-diff --help

# Run the live demo:
npm run demo
```

---

## CLI Usage

```bash
# Compare old vs new specification:
api-spec-diff openapi-v1.json openapi-v2.json

# Fail CI pipeline if breaking API changes exist:
api-spec-diff openapi-v1.json openapi-v2.json --strict

# Structured JSON output:
api-spec-diff openapi-v1.json openapi-v2.json --json
```

---

## Programmatic TypeScript API

```typescript
import { compareOpenApiSpecs } from 'api-spec-diff';

const diff = compareOpenApiSpecs(oldSpec, newSpec);
if (diff.hasBreaking) {
  console.error('Breaking API changes detected:');
  diff.breakingChanges.forEach((b) => console.error(b.message));
}
```

---

## Testing

```bash
npm test
```

---

## License

MIT © Essentials Toolkit Authors

