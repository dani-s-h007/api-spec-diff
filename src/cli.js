/**
 * api-spec-diff: CLI Interface
 */

import { parseArgs } from 'node:util';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { compareOpenApiSpecs } from './comparator.js';

export async function runCli(argv = process.argv.slice(2)) {
  const options = {
    help: { type: 'boolean', short: 'h', default: false },
    version: { type: 'boolean', short: 'v', default: false },
    old: { type: 'string', short: 'o' },
    new: { type: 'string', short: 'n' },
    strict: { type: 'boolean', short: 's', default: false },
    json: { type: 'boolean', default: false }
  };

  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: true });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.help) {
    printHelp();
    return 0;
  }

  if (values.version) {
    console.log('api-spec-diff v1.0.0');
    return 0;
  }

  const oldFile = values.old || positionals[0];
  const newFile = values.new || positionals[1];

  if (!oldFile || !newFile) {
    printHelp();
    return 0;
  }

  const oldPath = resolve(oldFile);
  const newPath = resolve(newFile);

  if (!existsSync(oldPath) || !existsSync(newPath)) {
    console.error('Error: Specified spec file does not exist.');
    process.exit(1);
  }

  const oldSpec = JSON.parse(readFileSync(oldPath, 'utf8'));
  const newSpec = JSON.parse(readFileSync(newPath, 'utf8'));

  const diff = compareOpenApiSpecs(oldSpec, newSpec);

  if (values.json) {
    console.log(JSON.stringify(diff, null, 2));
    if (values.strict && diff.hasBreaking) process.exit(1);
    return 0;
  }

  console.log('\n📡 api-spec-diff - OpenAPI Breaking Change Linter');
  console.log('============================================================');
  console.log(`Base Spec:     ${oldFile}`);
  console.log(`Updated Spec:  ${newFile}`);
  console.log(`Breaking:      ${diff.hasBreaking ? '\x1b[31mYES (Breaking Changes Detected)\x1b[0m' : '\x1b[32mNO (Backward Compatible)\x1b[0m'}\n`);

  if (diff.breakingChanges.length > 0) {
    console.log(`🚨 BREAKING CHANGES (${diff.breakingChanges.length}):`);
    for (const b of diff.breakingChanges) {
      console.log(`   ✖ ${b.message}`);
    }
    console.log('');
  }

  if (diff.nonBreakingChanges.length > 0) {
    console.log(`✨ Non-Breaking Additions (${diff.nonBreakingChanges.length}):`);
    for (const nb of diff.nonBreakingChanges) {
      console.log(`   ✔ ${nb.message}`);
    }
    console.log('');
  }

  console.log('============================================================\n');

  if (values.strict && diff.hasBreaking) {
    process.exit(1);
  }

  return 0;
}

function printHelp() {
  console.log(`
api-spec-diff - OpenAPI & JSON Schema Breaking Change Detector

USAGE:
  $ api-spec-diff <old-spec.json> <new-spec.json> [flags]

FLAGS:
  -o, --old <path>      Path to base OpenAPI spec JSON
  -n, --new <path>      Path to updated OpenAPI spec JSON
  -s, --strict          Exit with code 1 on breaking changes (ideal for CI)
      --json            Output structured JSON
  -v, --version         Show version
  -h, --help            Show help

EXAMPLES:
  # Check if PR introduces breaking API changes:
  $ api-spec-diff openapi-v1.json openapi-v2.json

  # Fail CI pipeline if breaking API change is detected:
  $ api-spec-diff openapi-v1.json openapi-v2.json --strict
`);
}

