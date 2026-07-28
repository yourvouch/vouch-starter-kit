import { ImageResponse } from "next/og";

export const alt = "Vouch Starter Kit 2.0 — Find the break and decide what deserves attention";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#081221",
          color: "#f8fafc",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "62px 68px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <strong style={{ fontSize: 34 }}>Vouch</strong>
            <span style={{ color: "#82a7ff", fontSize: 22 }}>Starter Kit 2.0</span>
          </div>
          <span style={{ border: "1px solid #2b4160", borderRadius: 999, padding: "10px 18px", fontSize: 17 }}>
            Open source · Local first · MIT
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 930 }}>
          <span style={{ color: "#82a7ff", fontSize: 18, letterSpacing: 3, textTransform: "uppercase" }}>
            Business decision intelligence
          </span>
          <div style={{ fontSize: 66, lineHeight: 1.05, letterSpacing: -2, marginTop: 18 }}>
            Find the break. Decide what deserves attention next.
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, color: "#aebbd0", fontSize: 20 }}>
          <span>Explore finished examples</span>
          <span>→</span>
          <span>Analyse CSV/XLSX locally</span>
          <span>→</span>
          <span>Build an industry pack</span>
        </div>
      </div>
    ),
    size,
  );
}
