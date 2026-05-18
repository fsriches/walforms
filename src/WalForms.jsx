import { useState } from "react";

const FIELD_TYPES = [
  { id: "text", label: "Short Text", icon: "✏️" },
  { id: "richtext", label: "Rich Text", icon: "📝" },
  { id: "dropdown", label: "Dropdown", icon: "📋" },
  { id: "checkbox", label: "Checkboxes", icon: "☑️" },
  { id: "rating", label: "Star Rating", icon: "⭐" },
  { id: "file", label: "File Upload", icon: "📎" },
  { id: "url", label: "URL Link", icon: "🔗" },
  { id: "confirm", label: "Confirmation", icon: "✅" },
];
const genId = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const DEMO_FORMS = [
  {
    id: "demo1", name: "Bug Report", description: "Report bugs and issues in the Walrus ecosystem",
    fields: [
      { id: "f1", type: "text", label: "Bug Title", required: true, options: [] },
      { id: "f2", type: "dropdown", label: "Severity", required: true, options: ["Critical", "High", "Medium", "Low"] },
      { id: "f3", type: "richtext", label: "Steps to Reproduce", required: true, options: [] },
      { id: "f4", type: "file", label: "Screenshot", required: false, options: [] },
      { id: "f5", type: "url", label: "Related URL", required: false, options: [] },
      { id: "f6", type: "confirm", label: "I confirm this bug is reproducible", required: true, options: [] },
    ],
    createdAt: "2026-05-10T08:00:00Z", encrypted: false,
    submissions: [
      { id: "s1", formId: "demo1", createdAt: "2026-05-12T10:30:00Z", priority: "high", note: "Confirmed — affects mainnet blob uploads", data: { f1: "Blob upload fails above 10MB", f2: "Critical", f3: "1. Go to publisher\n2. Upload 12MB file\n3. Error 500 returned", f4: null, f5: "https://publisher.walrus.site", f6: true } },
      { id: "s2", formId: "demo1", createdAt: "2026-05-13T14:20:00Z", priority: "medium", note: "", data: { f1: "UI misalignment on mobile", f2: "Low", f3: "Dashboard cards overlap on iPhone 14", f4: null, f5: "", f6: true } },
      { id: "s3", formId: "demo1", createdAt: "2026-05-15T09:00:00Z", priority: null, note: "", data: { f1: "Seal decryption timeout", f2: "High", f3: "When decrypting large blobs, the process hangs after 30s", f4: null, f5: "https://docs.walrus.site/seal", f6: true } },
    ],
  },
  {
    id: "demo2", name: "Feature Request", description: "Suggest new features for WalForms",
    fields: [
      { id: "g1", type: "text", label: "Feature Name", required: true, options: [] },
      { id: "g2", type: "richtext", label: "Description", required: true, options: [] },
      { id: "g3", type: "rating", label: "How important is this?", required: true, options: [] },
      { id: "g4", type: "checkbox", label: "Category", required: false, options: ["UI/UX", "Storage", "Security", "Performance", "API"] },
    ],
    createdAt: "2026-05-11T12:00:00Z", encrypted: true,
    submissions: [
      { id: "s4", formId: "demo2", createdAt: "2026-05-14T16:45:00Z", priority: null, note: "", data: { g1: "Collaborative form editing", g2: "Allow multiple admins to edit the same form simultaneously", g3: 5, g4: ["UI/UX", "API"] } },
    ],
  },
];

function StarRating({ value = 0, onChange, readonly = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: size, cursor: readonly ? "default" : "pointer", color: i <= (hover || value) ? "#eab308" : "#27272a", transition: "color 0.1s" }}
          onMouseEnter={() => !readonly && setHover(i)} onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => !readonly && onChange?.(i)}>★</span>
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  const base = { width: "100%", padding: "11px 14px", borderRadius: 2, border: "1px solid #27272a", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", background: "#09090b", color: "#e4e4e7", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" };
  const onF = e => { e.target.style.borderColor = "#6366f1"; };
  const onB = e => { e.target.style.borderColor = "#27272a"; };
  switch (field.type) {
    case "text": return <input style={base} placeholder={`Enter ${field.label.toLowerCase()}...`} value={value || ""} onChange={e => onChange(e.target.value)} onFocus={onF} onBlur={onB} />;
    case "richtext": return <textarea style={{ ...base, minHeight: 90, resize: "vertical" }} placeholder={`Enter ${field.label.toLowerCase()}...`} value={value || ""} onChange={e => onChange(e.target.value)} onFocus={onF} onBlur={onB} />;
    case "dropdown": return (<select style={{ ...base, cursor: "pointer" }} value={value || ""} onChange={e => onChange(e.target.value)}><option value="" style={{ background: "#09090b" }}>Select...</option>{(field.options || []).map(o => <option key={o} value={o} style={{ background: "#09090b" }}>{o}</option>)}</select>);
    case "checkbox": return (<div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{(field.options || []).map(o => { const c = (value || []).includes(o); return (<label key={o} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, padding: "7px 12px", borderRadius: 2, background: c ? "#18181b" : "transparent", border: `1px solid ${c ? "#6366f1" : "#27272a"}`, color: c ? "#c7d2fe" : "#71717a", transition: "all 0.15s" }}><input type="checkbox" checked={c} onChange={e => { const arr = value || []; onChange(e.target.checked ? [...arr, o] : arr.filter(x => x !== o)); }} style={{ accentColor: "#6366f1" }} />{o}</label>); })}</div>);
    case "rating": return <StarRating value={value || 0} onChange={onChange} />;
    case "file": return (<div style={{ ...base, border: "1px dashed #27272a", textAlign: "center", padding: 24, cursor: "pointer", color: "#52525b" }}><div style={{ fontSize: 24, marginBottom: 6 }}>↑</div><div style={{ fontSize: 12 }}>Upload file · stored on Walrus</div></div>);
    case "url": return <input style={base} type="url" placeholder="https://..." value={value || ""} onChange={e => onChange(e.target.value)} onFocus={onF} onBlur={onB} />;
    case "confirm": return (<label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#a1a1aa" }}><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} style={{ accentColor: "#6366f1", width: 16, height: 16 }} />{field.label}</label>);
    default: return null;
  }
}

// Corner bracket decoration component
function Corners({ children, style = {}, accent = false }) {
  const c = accent ? "#6366f1" : "#27272a";
  const sz = 10;
  const cornerStyle = (top, right, bottom, left) => ({
    position: "absolute",
    width: sz, height: sz,
    ...(top !== undefined && { top }),
    ...(right !== undefined && { right }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
    borderColor: c,
    borderStyle: "solid",
    borderWidth: 0,
    ...(top !== undefined && left !== undefined && { borderTopWidth: 1, borderLeftWidth: 1 }),
    ...(top !== undefined && right !== undefined && { borderTopWidth: 1, borderRightWidth: 1 }),
    ...(bottom !== undefined && left !== undefined && { borderBottomWidth: 1, borderLeftWidth: 1 }),
    ...(bottom !== undefined && right !== undefined && { borderBottomWidth: 1, borderRightWidth: 1 }),
  });
  return (
    <div style={{ position: "relative", ...style }}>
      <div style={cornerStyle(0, undefined, undefined, 0)} />
      <div style={cornerStyle(0, 0)} />
      <div style={cornerStyle(undefined, undefined, 0, 0)} />
      <div style={cornerStyle(undefined, 0, 0)} />
      {children}
    </div>
  );
}

export default function WalForms() {
  const [page, setPage] = useState("dashboard");
  const [forms, setForms] = useState(DEMO_FORMS);
  const [activeFormId, setActiveFormId] = useState(null);
  const [editingForm, setEditingForm] = useState(null);
  const [fillData, setFillData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [toast, setToast] = useState(null);
  const [copyFb, setCopyFb] = useState(false);

  const af = forms.find(f => f.id === activeFormId);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2500); };
  const goBuilder = (form) => { setEditingForm(form ? { ...form, fields: form.fields.map(f => ({ ...f })) } : { id: genId(), name: "", description: "", fields: [], encrypted: false, createdAt: now(), submissions: [] }); setPage("builder"); };
  const goFill = (id) => { setActiveFormId(id); setFillData({}); setSubmitted(false); setPage("fill"); };
  const goSubs = (id) => { setActiveFormId(id); setPage("submissions"); };
  const saveForm = () => {
    if (!editingForm.name.trim()) { showToast("Name required"); return; }
    if (!editingForm.fields.length) { showToast("Add fields"); return; }
    setForms(p => { const ex = p.find(f => f.id === editingForm.id); return ex ? p.map(f => f.id === editingForm.id ? { ...editingForm, submissions: f.submissions } : f) : [...p, { ...editingForm, submissions: [] }]; });
    showToast("Stored on Walrus"); setPage("dashboard");
  };
  const submitR = () => {
    const form = forms.find(f => f.id === activeFormId); if (!form) return;
    const miss = form.fields.filter(f => f.required && !fillData[f.id]);
    if (miss.length) { showToast(`Required: ${miss[0].label}`); return; }
    setForms(p => p.map(f => f.id === form.id ? { ...f, submissions: [...f.submissions, { id: genId(), formId: form.id, createdAt: now(), priority: null, note: "", data: { ...fillData } }] } : f));
    setSubmitted(true); showToast("Stored on Walrus");
  };
  const exportCSV = (form) => {
    if (!form?.submissions.length) return;
    const h = ["Date", "Priority", "Note", ...form.fields.map(f => f.label)];
    const rows = form.submissions.map(s => [new Date(s.createdAt).toLocaleDateString(), s.priority || "", s.note || "", ...form.fields.map(f => { const v = s.data[f.id]; return Array.isArray(v) ? v.join("; ") : v === true ? "Yes" : String(v || ""); })]);
    const csv = [h.join(","), ...rows.map(r => r.map(c => `"${(c || "").replace(/"/g, '""')}"`).join(","))].join("\n");
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: `${form.name.replace(/\s+/g, "_")}.csv` }).click();
    showToast("Exported");
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace" };
  const ib = { width: "100%", padding: "11px 14px", borderRadius: 2, border: "1px solid #27272a", fontSize: 14, fontFamily: "'Space Grotesk', sans-serif", background: "#09090b", color: "#e4e4e7", outline: "none", boxSizing: "border-box" };
  const bp = { padding: "9px 20px", borderRadius: 2, border: "1px solid #6366f1", background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 0.3 };
  const bt = { padding: "7px 14px", borderRadius: 2, border: "1px solid #27272a", background: "transparent", color: "#a1a1aa", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif" };

  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh", background: "#09090b", color: "#e4e4e7" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#27272a;border-radius:0}
        .gt{background:linear-gradient(90deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 240, background: "#09090b", borderRight: "1px solid #18181b", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 20, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #18181b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 2, background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🦭</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.5, color: "#fafafa" }}>WalForms</div>
              <div style={{ fontSize: 9, color: "#52525b", ...mono, letterSpacing: 2 }}>WALRUS · MAINNET</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "12px 8px", flex: 1 }}>
          {[{ id: "dashboard", l: "Dashboard", ic: "⬡" }, { id: "builder", l: "New form", ic: "+" }].map(item => (
            <button key={item.id} onClick={() => item.id === "builder" ? goBuilder(null) : setPage(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 2, border: page === item.id ? "1px solid #27272a" : "1px solid transparent", background: page === item.id ? "#18181b" : "transparent", color: page === item.id ? "#e4e4e7" : "#52525b", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", textAlign: "left", marginBottom: 2 }}>
              <span style={{ fontSize: 12, ...mono, width: 16 }}>{item.ic}</span> {item.l}
            </button>
          ))}
          <div style={{ height: 1, background: "#18181b", margin: "12px 12px" }} />
          <div style={{ padding: "0 12px" }}>
            <div style={{ fontSize: 9, color: "#3f3f46", fontWeight: 600, letterSpacing: 2, marginBottom: 8, ...mono }}>FORMS</div>
            {forms.map(f => (
              <button key={f.id} onClick={() => goSubs(f.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: 2, border: "none", background: activeFormId === f.id && page === "submissions" ? "#18181b" : "transparent", color: "#71717a", fontSize: 12, cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", textAlign: "left", marginBottom: 1 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <span style={{ fontSize: 10, ...mono, color: "#3f3f46" }}>{f.submissions.length}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #18181b" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ width: 5, height: 5, background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 10, color: "#52525b", ...mono }}>MAINNET</span>
          </div>
          <div style={{ fontSize: 10, color: "#3f3f46", ...mono }}>SEAL ACTIVE</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 240, padding: "32px 40px", minHeight: "100vh" }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <div style={{ animation: "fadeIn 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
              <div>
                <div style={{ fontSize: 10, ...mono, color: "#3f3f46", letterSpacing: 2, marginBottom: 6 }}>OVERVIEW</div>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fafafa", letterSpacing: -1 }}>Dashboard</h1>
              </div>
              <button style={bp} onClick={() => goBuilder(null)}>+ New form</button>
            </div>

            {/* Stats with corner brackets */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginBottom: 32, background: "#18181b" }}>
              {[
                { l: "FORMS", v: forms.length, c: "#818cf8" },
                { l: "RESPONSES", v: forms.reduce((a, f) => a + f.submissions.length, 0), c: "#a78bfa" },
                { l: "ENCRYPTED", v: forms.filter(f => f.encrypted).length, c: "#22d3ee" },
                { l: "BLOBS", v: forms.reduce((a, f) => a + f.submissions.length, 0) + forms.length, c: "#4ade80" },
              ].map((s, i) => (
                <div key={s.l} style={{ background: "#09090b", padding: "20px 24px" }}>
                  <div style={{ fontSize: 9, color: "#3f3f46", letterSpacing: 2, marginBottom: 10, ...mono }}>{s.l}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: s.c, ...mono, letterSpacing: -2 }}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* Form cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {forms.map(f => (
                <Corners key={f.id} accent style={{ cursor: "pointer" }}>
                  <div style={{ padding: 24, background: "#0c0c0f", transition: "background 0.2s" }} onClick={() => goSubs(f.id)}
                    onMouseEnter={e => e.currentTarget.style.background = "#111114"} onMouseLeave={e => e.currentTarget.style.background = "#0c0c0f"}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#fafafa" }}>{f.name}</h3>
                      {f.encrypted && <span style={{ fontSize: 10, ...mono, color: "#22d3ee", letterSpacing: 1 }}>SEALED</span>}
                    </div>
                    <p style={{ fontSize: 13, color: "#52525b", marginBottom: 16, lineHeight: 1.5 }}>{f.description}</p>
                    <div style={{ height: 1, background: "linear-gradient(90deg, #27272a, transparent)", marginBottom: 14 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 11, color: "#3f3f46", ...mono }}>{f.fields.length} fields · {f.submissions.length} resp</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button style={bt} onClick={e => { e.stopPropagation(); goFill(f.id); }}>fill</button>
                        <button style={bt} onClick={e => { e.stopPropagation(); goBuilder(f); }}>edit</button>
                        <button style={{ ...bt, borderColor: "#6366f1", color: "#818cf8" }} onClick={e => { e.stopPropagation(); goSubs(f.id); }}>view</button>
                      </div>
                    </div>
                  </div>
                </Corners>
              ))}
              <div style={{ border: "1px dashed #1e1e22", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 180, cursor: "pointer", transition: "border-color 0.2s" }} onClick={() => goBuilder(null)} onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"} onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e22"}>
                <div style={{ fontSize: 28, color: "#27272a", marginBottom: 8, ...mono }}>+</div>
                <div style={{ fontSize: 12, color: "#3f3f46" }}>New form</div>
              </div>
            </div>
          </div>
        )}

        {/* BUILDER */}
        {page === "builder" && editingForm && (
          <div style={{ animation: "fadeIn 0.3s", maxWidth: 780 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <button style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6, display: "block" }} onClick={() => setPage("dashboard")}>← back</button>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fafafa" }}>{editingForm.name || "New form"}</h1>
              </div>
              <button style={bp} onClick={saveForm}>Save to Walrus</button>
            </div>
            <div style={{ borderTop: "1px solid #6366f1", borderBottom: "1px solid #18181b", borderLeft: "none", borderRight: "none", padding: "24px 0", marginBottom: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, color: "#3f3f46", ...mono, letterSpacing: 1.5, display: "block", marginBottom: 6 }}>NAME *</label>
                <input style={ib} value={editingForm.name} onChange={e => setEditingForm(p => ({ ...p, name: e.target.value }))} placeholder="Bug Report, Feature Request..." />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 10, color: "#3f3f46", ...mono, letterSpacing: 1.5, display: "block", marginBottom: 6 }}>DESCRIPTION</label>
                <textarea style={{ ...ib, minHeight: 50, resize: "vertical" }} value={editingForm.description} onChange={e => setEditingForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#71717a" }}>
                <input type="checkbox" checked={editingForm.encrypted} onChange={e => setEditingForm(p => ({ ...p, encrypted: e.target.checked }))} style={{ accentColor: "#6366f1" }} />
                Seal encryption
              </label>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, ...mono, color: "#3f3f46", letterSpacing: 2, marginBottom: 12 }}>FIELDS [{editingForm.fields.length}]</div>
              {editingForm.fields.map((field, idx) => (
                <div key={field.id} style={{ padding: "16px 0", borderBottom: "1px solid #18181b", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ color: "#27272a", fontSize: 11, ...mono, paddingTop: 10, width: 20, textAlign: "right", flexShrink: 0 }}>{String(idx + 1).padStart(2, "0")}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input style={{ ...ib, flex: 1 }} value={field.label} onChange={e => { const f = [...editingForm.fields]; f[idx] = { ...f[idx], label: e.target.value }; setEditingForm(p => ({ ...p, fields: f })); }} placeholder="Label" />
                      <select style={{ ...ib, width: 140, fontSize: 12 }} value={field.type} onChange={e => { const f = [...editingForm.fields]; f[idx] = { ...f[idx], type: e.target.value }; setEditingForm(p => ({ ...p, fields: f })); }}>
                        {FIELD_TYPES.map(ft => <option key={ft.id} value={ft.id} style={{ background: "#09090b" }}>{ft.icon} {ft.label}</option>)}
                      </select>
                    </div>
                    {(field.type === "dropdown" || field.type === "checkbox") && (
                      <input style={{ ...ib, marginBottom: 6, fontSize: 12 }} value={(field.options || []).join(", ")} onChange={e => { const f = [...editingForm.fields]; f[idx] = { ...f[idx], options: e.target.value.split(",").map(o => o.trim()).filter(Boolean) }; setEditingForm(p => ({ ...p, fields: f })); }} placeholder="opt1, opt2, opt3" />
                    )}
                    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#52525b", cursor: "pointer" }}>
                      <input type="checkbox" checked={field.required} onChange={e => { const f = [...editingForm.fields]; f[idx] = { ...f[idx], required: e.target.checked }; setEditingForm(p => ({ ...p, fields: f })); }} style={{ accentColor: "#6366f1" }} />
                      required
                    </label>
                  </div>
                  <button style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, padding: "8px 4px" }} onClick={() => setEditingForm(p => ({ ...p, fields: p.fields.filter(f => f.id !== field.id) }))}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, paddingTop: 8 }}>
              {FIELD_TYPES.map(ft => (
                <button key={ft.id} style={{ ...bt, fontSize: 11 }}
                  onClick={() => setEditingForm(p => ({ ...p, fields: [...p.fields, { id: genId(), type: ft.id, label: "", required: false, options: ft.id === "dropdown" || ft.id === "checkbox" ? ["Option 1", "Option 2"] : [] }] }))}>
                  {ft.icon} {ft.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FILL */}
        {page === "fill" && af && (
          <div style={{ animation: "fadeIn 0.3s", maxWidth: 580, margin: "0 auto" }}>
            <button style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 20, display: "block" }} onClick={() => setPage("dashboard")}>← back</button>
            <Corners accent style={{ marginBottom: 24 }}>
              <div style={{ padding: "32px 36px", background: "#0c0c0f" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>🦭</span>
                  <span style={{ fontSize: 10, ...mono, color: "#6366f1", letterSpacing: 2 }}>WALFORMS</span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fafafa", marginBottom: 6 }}>{af.name}</h1>
                <p style={{ fontSize: 13, color: "#52525b", lineHeight: 1.5 }}>{af.description}</p>
                {af.encrypted && <div style={{ marginTop: 10, fontSize: 10, ...mono, color: "#22d3ee", letterSpacing: 1 }}>SEAL ENCRYPTED</div>}
              </div>
            </Corners>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>✓</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fafafa", marginBottom: 8 }}>Submitted</h2>
                <p style={{ fontSize: 12, ...mono, color: "#3f3f46" }}>blob: walrus_{genId()}</p>
                <button style={{ ...bp, marginTop: 20 }} onClick={() => { setFillData({}); setSubmitted(false); }}>Another</button>
              </div>
            ) : (
              <div>
                {af.fields.map(field => (
                  <div key={field.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #18181b" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#d4d4d8" }}>
                      {field.label} {field.required && <span style={{ color: "#ef4444", fontSize: 11 }}>*</span>}
                    </label>
                    <FieldInput field={field} value={fillData[field.id]} onChange={v => setFillData(p => ({ ...p, [field.id]: v }))} />
                  </div>
                ))}
                <button style={{ ...bp, width: "100%", padding: "13px", fontSize: 14 }} onClick={submitR}>Submit</button>
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 9, ...mono, color: "#27272a", letterSpacing: 1 }}>WALFORMS · WALRUS · {af.encrypted ? "SEAL" : "PUBLIC"}</div>
              </div>
            )}
          </div>
        )}

        {/* SUBMISSIONS */}
        {page === "submissions" && af && (
          <div style={{ animation: "fadeIn 0.3s" }}>
            <button style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 10, display: "block" }} onClick={() => setPage("dashboard")}>← dashboard</button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#fafafa", marginBottom: 4 }}>{af.name}</h1>
                <div style={{ fontSize: 11, ...mono, color: "#3f3f46" }}>{af.submissions.length} entries · {af.encrypted ? "sealed" : "public"}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={bt} onClick={() => { navigator.clipboard?.writeText(`walforms.wal.app/f/${af.id}`); setCopyFb(true); setTimeout(() => setCopyFb(false), 1500); }}>{copyFb ? "copied" : "share"}</button>
                <button style={bt} onClick={() => goFill(af.id)}>fill</button>
                <button style={bt} onClick={() => goBuilder(af)}>edit</button>
                <button style={bp} onClick={() => exportCSV(af)}>export csv</button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input style={{ ...ib, maxWidth: 260, fontSize: 12 }} placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)} />
              <select style={{ ...ib, width: 130, fontSize: 12 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                {[["all", "All"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]].map(([v, l]) => <option key={v} value={v} style={{ background: "#09090b" }}>{l}</option>)}
              </select>
            </div>
            {!af.submissions.length ? (
              <div style={{ textAlign: "center", padding: 48, color: "#27272a" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>—</div>
                <div style={{ fontSize: 12 }}>No entries</div>
              </div>
            ) : (
              <div style={{ borderTop: "1px solid #27272a" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {["DATE", ...af.fields.slice(0, 3).map(f => f.label.toUpperCase().slice(0, 14)), "PRI", "NOTE", ""].map((h, i) => (
                        <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 500, fontSize: 9, color: "#3f3f46", letterSpacing: 1.5, ...mono, borderBottom: "1px solid #18181b" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {af.submissions
                      .filter(s => filterPriority === "all" || s.priority === filterPriority)
                      .filter(s => !searchText || Object.values(s.data).map(v => String(v)).join(" ").toLowerCase().includes(searchText.toLowerCase()))
                      .map(sub => (
                        <tr key={sub.id} style={{ borderBottom: "1px solid #18181b", transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = "#0f0f12"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "12px", color: "#52525b", ...mono, fontSize: 11, whiteSpace: "nowrap" }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                          {af.fields.slice(0, 3).map(f => {
                            const v = sub.data[f.id];
                            const d = Array.isArray(v) ? v.join(", ") : v === true ? "✓" : f.type === "rating" ? <StarRating value={v} readonly size={12} /> : String(v || "—");
                            return <td key={f.id} style={{ padding: "12px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#71717a" }}>{d}</td>;
                          })}
                          <td style={{ padding: "12px" }}>
                            <select value={sub.priority || ""} onChange={e => setForms(p => p.map(f => f.id === af.id ? { ...f, submissions: f.submissions.map(s => s.id === sub.id ? { ...s, priority: e.target.value || null } : s) } : f))} style={{ border: "1px solid #27272a", background: "#09090b", borderRadius: 2, color: "#71717a", fontSize: 11, padding: "3px 6px", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>
                              {[["", "—"], ["high", "H"], ["medium", "M"], ["low", "L"]].map(([v, l]) => <option key={v} value={v} style={{ background: "#09090b" }}>{l}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <input style={{ border: "1px solid #18181b", background: "transparent", borderRadius: 2, padding: "4px 8px", fontSize: 11, width: 120, fontFamily: "'Space Grotesk',sans-serif", color: "#71717a", outline: "none" }}
                              placeholder="note..." value={sub.note || ""} onChange={e => setForms(p => p.map(f => f.id === af.id ? { ...f, submissions: f.submissions.map(s => s.id === sub.id ? { ...s, note: e.target.value } : s) } : f))} />
                          </td>
                          <td style={{ padding: "12px" }}>
                            <button style={{ background: "none", border: "none", color: "#3f3f46", cursor: "pointer", fontSize: 14 }} onClick={() => setForms(p => p.map(f => f.id === af.id ? { ...f, submissions: f.submissions.filter(s => s.id !== sub.id) } : f))}>×</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#18181b", border: "1px solid #27272a", color: "#e4e4e7", padding: "10px 24px", fontSize: 13, zIndex: 999, animation: "slideUp 0.2s", fontFamily: "'Space Grotesk',sans-serif", borderRadius: 2 }}>{toast}</div>}
    </div>
  );
}
