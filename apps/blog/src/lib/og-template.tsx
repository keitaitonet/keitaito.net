import type { ReactElement } from "react";
import logoSvg from "../assets/logo.svg?raw";

const COLOR_BG = "#ffffff";
const COLOR_FG = "#1d1f23";
const COLOR_MUTED = "#797b80";
const COLOR_BORDER = "#e6e8eb";
const COLOR_PRIMARY = "#007268";

const FONT_SANS = "Noto Sans JP";

const LOGO_HEIGHT = 32;
const LOGO_WIDTH = Math.round((317 / 39) * LOGO_HEIGHT);
const LOGO_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`;

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  keywords: string[];
}

const MAX_DESCRIPTION_CHARS = 80;
const truncate = (s: string, max: number) =>
  s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;

export const renderOgTemplate = ({
  eyebrow,
  title,
  description,
  keywords,
}: Props): ReactElement => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "100%",
      height: "100%",
      padding: 72,
      background: COLOR_BG,
      fontFamily: FONT_SANS,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          fontSize: 20,
          textTransform: "uppercase",
          letterSpacing: "0.24em",
          color: COLOR_PRIMARY,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 88,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: COLOR_FG,
          marginTop: 36,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 26,
          lineHeight: 1.5,
          color: COLOR_MUTED,
          marginTop: 32,
          maxHeight: 78,
          overflow: "hidden",
        }}
      >
        {truncate(description, MAX_DESCRIPTION_CHARS)}
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column" }}>
      {keywords.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 18,
            color: COLOR_MUTED,
            letterSpacing: "0.04em",
            marginBottom: 32,
          }}
        >
          {keywords.map((k) => (
            <div key={k} style={{ display: "flex" }}>
              {k}
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          display: "flex",
          height: 1,
          background: COLOR_BORDER,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 28,
        }}
      >
        <img src={LOGO_SRC} width={LOGO_WIDTH} height={LOGO_HEIGHT} alt="" />
      </div>
    </div>
  </div>
);
