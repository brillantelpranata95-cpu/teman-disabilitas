/**
 * Icon — loader ikon SVG (sumber: koboyo.com/icons, lisensi bebas komersial).
 * Semua file SVG di src/assets/koboyo dimuat lazy via import.meta.glob.
 * Pemakaian: <Icon name="wheelchair" className="h-5 w-5" />
 */
import { useEffect, useState } from "react";

const modules = import.meta.glob("../assets/koboyo/*.svg", { query: "?raw", import: "default" });

const cache = new Map();

export default function Icon({ name, className = "h-5 w-5", title }) {
  const [svg, setSvg] = useState(cache.get(name) || null);

  useEffect(() => {
    let alive = true;
    if (cache.has(name)) { setSvg(cache.get(name)); return; }
    const loader = modules[`../assets/koboyo/${name}.svg`];
    if (!loader) { setSvg(null); return; }
    loader().then((raw) => {
      cache.set(name, raw);
      if (alive) setSvg(raw);
    }).catch(() => { if (alive) setSvg(null); });
    return () => { alive = false; };
  }, [name]);

  if (!svg) {
    // Placeholder kotak netral selagi ikon dimuat — hindari layout shift.
    return <span className={`inline-block shrink-0 ${className}`} aria-hidden="true" />;
  }

  const html = svg
    .replace(/fill="currentColor"/g, "")
    .replace("<svg ", `<svg class="${className}" fill="currentColor" `);

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
