import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compareOpenApiSpecs } from '../src/comparator.js';

describe('api-spec-diff', () => {
  it('flags removed endpoints and methods as breaking', () => {
    const oldSpec = {
      paths: {
        '/auth': { post: {} },
        '/users': { get: {} }
      }
    };
    const newSpec = {
      paths: {
        '/users': { get: {} }
      }
    };

    const diff = compareOpenApiSpecs(oldSpec, newSpec);
    assert.equal(diff.hasBreaking, true);
    assert.equal(diff.breakingChanges.length, 1);
    assert.ok(diff.breakingChanges[0].message.includes('Removed entire endpoint'));
  });

  it('flags newly required query parameters as breaking', () => {
    const oldSpec = {
      paths: {
        '/items': { get: { parameters: [] } }
      }
    };
    const newSpec = {
      paths: {
        '/items': {
          get: {
            parameters: [{ name: 'tenantId', in: 'query', required: true }]
          }
        }
      }
    };

    const diff = compareOpenApiSpecs(oldSpec, newSpec);
    assert.equal(diff.hasBreaking, true);
    assert.ok(diff.breakingChanges[0].message.includes('Added new REQUIRED parameter'));
  });

  it('classifies newly added optional endpoints as non-breaking', () => {
    const oldSpec = { paths: { '/v1': { get: {} } } };
    const newSpec = { paths: { '/v1': { get: {} }, '/v2': { get: {} } } };

    const diff = compareOpenApiSpecs(oldSpec, newSpec);
    assert.equal(diff.hasBreaking, false);
    assert.equal(diff.nonBreakingChanges.length, 1);
  });
});

