# GLOSSARY — inspector-gadget

Per-repo vocabulary; one anchor per term, updated whenever the meaning shifts.

| Term | Meaning |
|---|---|
| **inspector-gadget** | This repo, the Claude Code slash command `/inspector-gadget`, and the node tool it invokes — one name across all three. |
| **structural read** | The operation this tool performs: a dense, structural interpretation of a codebase. Produces (a) an interactive DSM HTML artifact, (b) an in-chat namespace-level ASCII overview. Not advice. |
| **context** | Top-level grouping. **TS**: each immediate child dir of `--code-root` (excluding dot-dirs and `node_modules/dist/build`). **.NET**: each first-party assembly. |
| **namespace** | Second level. **TS**: first path segment below the context's source root (`src/` if present, else the context dir); files in the source root → `(root)`. **.NET**: C# namespace; types with no namespace → `(root)`. Labels are context-qualified: `{ctx} · {ns}`. |
| **leaf** | Bottom level. **TS**: file (`.ts`/`.tsx`, incl. `.d.ts`). **.NET**: type. |
| **edge** | A dependency from one leaf to another. **TS**: value import. **.NET**: type→type (structural metadata + decoded method-body IL). |
| **type-only cross-context edge** | TS-only: `import type` / `export type` that crosses a context boundary; surfaced separately, never enters cycle analysis (compile-time only, no runtime weight). |
| **third-party** | Non-first-party reference. **TS**: external package (npm), excluding `node:` builtins. **.NET**: any referenced external assembly (incl. `System.*`/`Microsoft.*`). Sinks: never appear in cycle analysis. |
| **SCC** | Strongly-connected component (Tarjan). A **cycle** at a given level = an SCC of size > 1. Computed at file, namespace, and context levels. |
| **DSM** | Dependency Structure Matrix — the interactive HTML view (`codebase-dsm.html`). Cell `(r, c)` reads "row depends on col". Nested NDepend-style: contexts/namespaces expand and collapse, parents aggregate descendants. |
| **triangular order** | Dependency-first sibling order (vs. alphabetical) — dependencies pushed down/right so the matrix reads top-to-bottom. SCCs grouped contiguously. |
| **palette** | Fixed pastel colour sets assigned to contexts/namespaces by **sorted name** → deterministic across runs. |
| **analyzer** | Per-ecosystem code producing the **raw shape** `{files, fileCtx, fileNs, edges, tpEdges, tpPkgs, typeXctxEdges}`. Two exist: `analyze-ts.mjs` (in-process node) and `analyze-dotnet/` (BCL-only C# helper invoked via `dotnet run`). |
| **model** | The finalized, ecosystem-agnostic data — adds palette colours, per-level SCCs, cluster adjacency, ns→files map. Built by `model.mjs#assemble()`. |
| **renderer** | `render.mjs` — turns a model into `codebase-dsm.html` and emits a compact JSON summary on stdout. |
| **orchestrator** | `index.mjs` — auto-detects ecosystem(s), dispatches to the matching analyzer(s), merges raw outputs, runs model + render. |
| **wire contract** | The unenforced cross-language protocol: node-id prefixes `c:`/`n:`/`f:` and the JSON payload keys consumed by `assets/dsm.client.js`. Change one side → must change the other. |
| **dotnet helper** | `tools/inspector-gadget/analyze-dotnet/` — BCL-only C# console project (net10.0). NOT a NuGet `dotnet tool` deliverable: no `PackAsTool`, no command name, no version. Just .NET code invoked by the orchestrator. |
| **yolo / afk** | Workflow keywords (global). `yolo` = approval to cross the plan→build hard stop. `afk` = no clarifying questions; resolve LLM-first. See `~/.claude/CLAUDE.md`. |
