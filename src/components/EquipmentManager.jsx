import { useMemo, useState } from "react";
import Icon from "./Icon";
import { Modal } from "./PublicCatalog";
import { useToast } from "../context/ToastContext";
import { saveEquipment, deleteEquipment } from "../services/firestoreService";
import { JENIS_ALAT, JENIS_ALAT_ICON, generateId, downloadCsv } from "../utils/constants";

export default function EquipmentManager({ equipment, loading }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [view, setView] = useState("table"); // 'table' | 'grid'
  const [editing, setEditing] = useState(null); // null | {} | item

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return equipment;
    return equipment.filter(
      (e) =>
        (e.namaAlat || "").toLowerCase().includes(s) ||
        (e.pemilik || "").toLowerCase().includes(s) ||
        (e.jenisAlat || "").toLowerCase().includes(s)
    );
  }, [equipment, q]);

  const totals = useMemo(() => ({
    items: equipment.length,
    stok: equipment.reduce((a, e) => a + (e.stokTotal || 0), 0),
    available: equipment.reduce((a, e) => a + (e.stokTersedia || 0), 0),
  }), [equipment]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus "${item.namaAlat}" dari inventaris?`)) return;
    try {
      await deleteEquipment(item.id);
      toast(`Alat "${item.namaAlat}" dihapus.`, "info");
    } catch (err) {
      console.error(err);
      toast("Gagal menghapus alat.", "error");
    }
  };

  const exportCsv = () => {
    downloadCsv(
      `inventaris-perisai-temon-${new Date().toISOString().split("T")[0]}.csv`,
      filtered,
      [
        { key: "id", label: "ID" },
        { key: "namaAlat", label: "Nama Alat" },
        { key: "jenisAlat", label: "Jenis" },
        { key: "pemilik", label: "Pemilik" },
        { key: "kondisi", label: "Kondisi" },
        { key: "stokTotal", label: "Stok Total" },
        { key: "stokTersedia", label: "Stok Tersedia" },
      ]
    );
    toast("Data inventaris diekspor ke CSV.");
  };

  if (loading) {
    return <div className="card p-12 text-center text-sm text-slate-500">Memuat inventaris…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header + stats */}
      <div className="card flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Kelola Inventaris Alat Bantu</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Tambah, ubah, atau hapus data alat. Perubahan langsung tampil di katalog publik.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCsv} className="btn-secondary !py-2.5 !text-xs">
            <Icon name="download" className="h-3.5 w-3.5" /> Ekspor CSV
          </button>
          <button onClick={() => setEditing({})} className="btn-primary !py-2.5 !text-xs">
            <Icon name="plus" className="h-3.5 w-3.5" /> Tambah Alat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          ["Jenis Alat", totals.items, "package"],
          ["Total Unit", totals.stok, "box"],
          ["Siap Dipinjam", totals.available, "circle-check"],
        ].map(([label, val, icon]) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <div className="rounded-2xl bg-perisai-100 p-2.5 text-perisai-700">
              <Icon name={icon} className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="text-xl font-extrabold text-slate-900">{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="input !py-2.5 pl-10"
            placeholder="Cari alat, jenis, atau pemilik…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
          {[["table", "list"], ["grid", "grid"]].map(([v, icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition ${
                view === v ? "bg-white text-perisai-800 shadow-sm" : "text-slate-500"
              }`}
            >
              <Icon name={icon} className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-sm text-slate-500">
          Tidak ada data inventaris.
        </div>
      ) : view === "table" ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-b bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-4">Alat</th>
                  <th className="p-4">Jenis</th>
                  <th className="p-4">Pemilik</th>
                  <th className="p-4 text-center">Tersedia / Total</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/70">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={e.foto}
                          alt=""
                          className="h-10 w-10 rounded-xl border border-slate-200 object-cover"
                          onError={(ev) => { ev.currentTarget.style.visibility = "hidden"; }}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">{e.namaAlat}</p>
                          <p className="font-mono text-[10px] text-slate-400">{e.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="chip bg-perisai-50 text-perisai-800">
                        <Icon name={JENIS_ALAT_ICON[e.jenisAlat] || "package"} className="h-3 w-3" />
                        {e.jenisAlat}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{e.pemilik}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`chip ${
                          (e.stokTersedia ?? 0) > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {e.stokTersedia} / {e.stokTotal}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => setEditing(e)} className="btn-secondary !p-2" title="Edit">
                          <Icon name="pencil" className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(e)}
                          className="btn !bg-rose-50 !p-2 text-rose-600 hover:!bg-rose-100"
                          title="Hapus"
                        >
                          <Icon name="trash" className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <div key={e.id} className="card overflow-hidden">
              <img
                src={e.foto}
                alt=""
                className="h-36 w-full object-cover"
                onError={(ev) => { ev.currentTarget.style.display = "none"; }}
              />
              <div className="space-y-3 p-4">
                <div>
                  <p className="font-bold leading-snug text-slate-900">{e.namaAlat}</p>
                  <p className="text-[11px] text-slate-500">{e.pemilik}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="chip bg-perisai-50 text-perisai-800">{e.jenisAlat}</span>
                  <span className="text-xs font-bold text-slate-700">
                    {e.stokTersedia}/{e.stokTotal} unit
                  </span>
                </div>
                <div className="flex gap-2 border-t border-slate-100 pt-3">
                  <button onClick={() => setEditing(e)} className="btn-secondary flex-1 !py-2 !text-xs">
                    <Icon name="pencil" className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(e)} className="btn-danger flex-1 !py-2 !text-xs">
                    <Icon name="trash" className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EquipmentFormModal
          item={editing.id ? editing : null}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

/* ---------- Form tambah/edit ---------- */

function EquipmentFormModal({ item, onClose }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    id: item?.id || generateId("EQ"),
    namaAlat: item?.namaAlat || "",
    jenisAlat: item?.jenisAlat || "Mobilisasi",
    foto: item?.foto || "",
    pemilik: item?.pemilik || "Pemerintah Kapanewon Temon",
    statusUtama: item?.statusUtama || "Tersedia",
    stokTotal: item?.stokTotal ?? 1,
    stokTersedia: item?.stokTersedia ?? 1,
    kondisi: item?.kondisi || "Baik",
    deskripsi: item?.deskripsi || "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.namaAlat.trim() && Number(form.stokTotal) >= 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    try {
      const total = Number(form.stokTotal);
      const tersedia = Math.min(Number(form.stokTersedia), total);
      await saveEquipment({ ...form, stokTotal: total, stokTersedia: tersedia });
      toast(item ? `Data "${form.namaAlat}" diperbarui.` : `Alat "${form.namaAlat}" ditambahkan.`);
      onClose();
    } catch (err) {
      console.error(err);
      toast("Gagal menyimpan data alat.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal onClose={onClose} title={item ? "Edit Data Alat" : "Tambah Alat Baru"} wide>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="ef-nama">Nama Alat *</label>
          <input id="ef-nama" className="input" value={form.namaAlat}
            onChange={set("namaAlat")} placeholder="Contoh: Kursi Roda Standard Ergonomis" required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="ef-jenis">Jenis Alat</label>
            <select id="ef-jenis" className="input" value={form.jenisAlat} onChange={set("jenisAlat")}>
              {JENIS_ALAT.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ef-kondisi">Kondisi</label>
            <select id="ef-kondisi" className="input" value={form.kondisi} onChange={set("kondisi")}>
              {["Baik", "Cukup", "Perlu Perbaikan"].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="ef-pemilik">Pemilik / Sumber</label>
          <input id="ef-pemilik" className="input" value={form.pemilik} onChange={set("pemilik")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="ef-total">Stok Total *</label>
            <input id="ef-total" type="number" min={0} className="input" value={form.stokTotal}
              onChange={set("stokTotal")} required />
          </div>
          <div>
            <label className="label" htmlFor="ef-tersedia">Stok Tersedia</label>
            <input id="ef-tersedia" type="number" min={0} className="input" value={form.stokTersedia}
              onChange={set("stokTersedia")} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="ef-foto">URL Foto Alat</label>
          <input id="ef-foto" className="input" value={form.foto} onChange={set("foto")}
            placeholder="https://…" />
          {form.foto && (
            <img
              src={form.foto}
              alt="Pratinjau"
              className="mt-2 h-32 w-full rounded-2xl border border-slate-200 object-cover"
              onError={(ev) => { ev.currentTarget.style.display = "none"; }}
            />
          )}
        </div>

        <div>
          <label className="label" htmlFor="ef-desk">Deskripsi</label>
          <textarea id="ef-desk" rows={3} className="input resize-none" value={form.deskripsi}
            onChange={set("deskripsi")} placeholder="Deskripsi singkat alat…" />
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Batal</button>
          <button type="submit" disabled={!valid || busy} className="btn-primary flex-1">
            <Icon name="save" className="h-4 w-4" /> {busy ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
