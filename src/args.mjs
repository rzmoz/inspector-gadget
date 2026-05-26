// CLI argument parsing — the tool is config-file-free: every setting comes from
// args + built-in defaults (there is no inspector-morse.json). `parseCli()`
// returns the chosen ecosystem `command` (node|dotnet), the `help` flag, the raw
// `root` (for validation messages), and a ready-to-use `config`
// ({ root, exclude, title, output }) when the args describe a runnable node scan.
// cli.mjs validates command/root and reports errors; dsm.mjs re-reads the same
// argv to obtain `config` and render.
import { parseArgs } from 'node:util';
import { resolve, basename } from 'node:path';

// node-ecosystem defaults: directory names skipped while walking (the old
// `exclude` config key). In node, .d.ts type declarations are ALWAYS scanned.
const NODE_EXCLUDES = ['node_modules', 'dist', 'build'];

export const USAGE = `usage: inspector-morse <node|dotnet> --code-root <dir> [-h|--help]

  <node|dotnet>   target ecosystem to inspect
                    node    TypeScript/Node project (.d.ts always included)
                    dotnet  not implemented
  --code-root <dir>    project root to scan (required)
  -h, --help      show this help and exit

Writes codebase-dsm.html into <dir>; the page title is the root dir name.`;

export function parseCli(argv = process.argv.slice(2)) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: { 'code-root': { type: 'string' }, help: { type: 'boolean', short: 'h' } },
  });
  const command = positionals[0] ?? null;
  const root = values['code-root'] ?? null;
  let config = null;
  if (command === 'node' && root) {
    const abs = resolve(root);
    config = {
      root: abs,
      exclude: NODE_EXCLUDES,
      title: basename(abs) || abs,
      output: { dsm: resolve(abs, 'codebase-dsm.html') },
    };
  }
  return { command, help: !!values.help, root, config };
}
