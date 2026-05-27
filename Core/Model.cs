namespace InspectorGadget.Core;

// A dependency between two leaf nodes (files or types), identified by their string
// ids. Value equality (ordinal) lets a HashSet<Edge> dedup directly — replacing
// the old "from>to" string keys.
internal readonly record struct Edge(string From, string To);

// A reference from a first-party leaf to a third-party package / external assembly.
internal readonly record struct TpRef(string From, string Package);

// The ecosystem-agnostic dependency model — the single shared definition of "the
// codebase" that every analyzer (Node + .NET) produces and that the Viewer
// renders. Nothing here knows about any one language: it is just contexts,
// namespaces, files, import edges, per-level SCCs, and third-party references.
internal sealed class Model
{
    // Namespace labels are context-qualified as "{context}{NsSep}{name}" by every
    // analyzer and split back on NsSep by the viewer — one definition, shared.
    public const string NsSep = " · ";

    public required List<string> Files;
    public required List<Edge> Edges;
    public required Scc<string> FileScc;
    public required Scc<string> GroupScc;
    public required Scc<string> CtxScc;
    public required List<string> AllGroups;
    public required List<string> AllCtx;
    public required Dictionary<string, List<string>> ByGroup;
    public required Dictionary<string, string> FileCtx;
    public required Dictionary<string, string> FileNs;
    public required Dictionary<string, string> CtxColourMap;
    public required Dictionary<string, string> NsColourMap;
    public required List<string> ContextOrder; // usedCtx (sorted)
    public required List<string> TpPackages;
    public required List<TpRef> TpEdges;
    public required List<Edge> TypeXctxEdges;

    public string ContextOf(string f) => FileCtx.TryGetValue(f, out var v) ? v : "other";
    public string GroupOf(string f) => FileNs.TryGetValue(f, out var v) ? v : "other";
    public string CtxColour(string n) => CtxColourMap.TryGetValue(n, out var v) ? v : "#ffffff";
    public string ColourOf(string g) => NsColourMap.TryGetValue(g, out var v) ? v : "#ffffff";
}
