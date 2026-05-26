#!/usr/bin/env node
// inspector-morse CLI. Inspects a codebase and writes a self-contained
// codebase-dsm.html (Matrix + Graph tabs) into the target root.
//
//   inspector-morse <node|dotnet> --code-root <dir> [-h|--help]
//
// There is no config file: every setting comes from CLI args + built-in
// defaults (see src/args.mjs). `node` scans a TypeScript/Node project; `dotnet`
// is not implemented yet.
import { parseCli, USAGE } from '../src/args.mjs';

let cli;
try {
  cli = parseCli();
} catch (e) {
  console.error(`error: ${e.message}\n\n${USAGE}`);
  process.exit(1);
}

if (cli.help) { console.log(USAGE); process.exit(0); }
if (!cli.command) { console.error(`error: missing target ecosystem (node|dotnet)\n\n${USAGE}`); process.exit(1); }
if (!['node', 'dotnet'].includes(cli.command)) { console.error(`error: unknown target "${cli.command}" (expected node|dotnet)\n\n${USAGE}`); process.exit(1); }
if (cli.command === 'dotnet') { console.error('error: dotnet inspection is not implemented'); process.exit(1); }
if (!cli.root) { console.error(`error: --code-root <dir> is required\n\n${USAGE}`); process.exit(1); }

// The renderer self-runs on import: it re-reads argv (via parseCli) for the
// config and writes the combined Matrix + Graph viewer in one pass.
await import('../src/dsm.mjs');
