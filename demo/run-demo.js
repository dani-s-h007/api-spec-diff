#!/usr/bin/env node
/**
 * api-spec-diff: Interactive Live Demo
 */

import { compareOpenApiSpecs } from '../src/comparator.js';

console.log('\n=== [DEMO] Starting api-spec-diff ===\n');

const v1Spec = {
  openapi: '3.0.0',
  paths: {
    '/users': {
      get: { parameters: [] },
      post: { parameters: [] }
    },
    '/legacy-payments': {
      post: { parameters: [] }
    }
  }
};

const v2Spec = {
  openapi: '3.0.0',
  paths: {
    '/users': {
      get: {
        // BREAKING: Added a newly REQUIRED query param
        parameters: [{ name: 'tenantId', in: 'query', required: true }]
      },
      post: { parameters: [] }
    },
    // BREAKING: Removed /legacy-payments
    // NON-BREAKING: Added /checkout
    '/checkout': {
      post: { parameters: [] }
    }
  }
};

console.log('Comparing OpenAPI v1 vs v2 Spec Changes:');
const diff = compareOpenApiSpecs(v1Spec, v2Spec);

console.log(`Has Breaking Changes: ${diff.hasBreaking ? 'YES (Would break existing clients)' : 'NO'}\n`);

console.log('[BREAKING] Changes:');
diff.breakingChanges.forEach((b) => console.log(` - ${b.message}`));

console.log('\n[NON-BREAKING] Changes:');
diff.nonBreakingChanges.forEach((nb) => console.log(` - ${nb.message}`));

console.log('\n[SUCCESS] Demo completed successfully.\n');

