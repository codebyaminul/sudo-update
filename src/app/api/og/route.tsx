import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Community Intelligence Network";
    const category = searchParams.get("category") || "TECH";
    const author = searchParams.get("author") || "root_operator";
    const boosts = searchParams.get("boosts") || "24";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0a0e14",
            padding: "50px 60px",
            fontFamily: "monospace",
            color: "#e6edf3",
            border: "12px solid #141b27",
            boxSizing: "border-box",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #1f2d42",
              paddingBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: "2px solid #00ff66",
                  backgroundColor: "rgba(0, 255, 102, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#00ff66",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                &gt;_
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "#00ff66",
                    fontSize: "24px",
                    fontWeight: "900",
                    letterSpacing: "-0.5px",
                  }}
                >
                  sudo update
                </span>
                <span
                  style={{
                    color: "#8b949e",
                    fontSize: "12px",
                    letterSpacing: "3px",
                  }}
                >
                  COMMUNITY_INTEL_NETWORK
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 16px",
                border: "1px solid #00f0ff",
                backgroundColor: "rgba(0, 240, 255, 0.1)",
                color: "#00f0ff",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              [#{category.toUpperCase()}]
            </div>
          </div>

          {/* Headline Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              margin: "30px 0",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                color: "#00ff66",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              guest@sudoupdate:~$ ./inspect_dispatch.sh
            </div>
            <div
              style={{
                fontSize: "44px",
                fontWeight: "900",
                lineHeight: "1.2",
                color: "#ffffff",
                maxHeight: "220px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer Telemetry */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "2px solid #1f2d42",
              paddingTop: "20px",
              fontSize: "16px",
              color: "#8b949e",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <span>
                TRANSMITTED BY:{" "}
                <span style={{ color: "#ffffff", fontWeight: "bold" }}>
                  @{author}
                </span>
              </span>
              <span>
                SIGNAL:{" "}
                <span style={{ color: "#00ff66", fontWeight: "bold" }}>
                  [▲ {boosts}]
                </span>
              </span>
            </div>

            <div style={{ color: "#4b5563" }}>
              CLEARANCE: VERIFIED // ENCRYPTED
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
