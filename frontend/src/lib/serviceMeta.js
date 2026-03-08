// Service brand colors and icons mapping
export const SERVICE_META = {
  netflix: {
    color: "#E50914",
    glow: "#E50914",
    label: "NETFLIX",
    icon: "▶",
    bg: "#1a0000",
  },
  spotify: {
    color: "#1DB954",
    glow: "#1DB954",
    label: "SPOTIFY",
    icon: "♪",
    bg: "#001a07",
  },
  youtube: {
    color: "#FF0000",
    glow: "#FF4040",
    label: "YOUTUBE",
    icon: "▷",
    bg: "#1a0000",
  },
  google: {
    color: "#4285F4",
    glow: "#4285F4",
    label: "GOOGLE",
    icon: "⬡",
    bg: "#00001a",
  },
  canva: {
    color: "#00C4CC",
    glow: "#00C4CC",
    label: "CANVA",
    icon: "✦",
    bg: "#001a1b",
  },
  disney: {
    color: "#113CCF",
    glow: "#4060FF",
    label: "DISNEY+",
    icon: "★",
    bg: "#000d2e",
  },
  prime: {
    color: "#00A8E0",
    glow: "#00A8E0",
    label: "PRIME",
    icon: "⬛",
    bg: "#00111a",
  },
  microsoft: {
    color: "#00BCF2",
    glow: "#00BCF2",
    label: "MICROSOFT",
    icon: "⊞",
    bg: "#001219",
  },
  default: {
    color: "#00e5ff",
    glow: "#00e5ff",
    label: "SERVICE",
    icon: "◈",
    bg: "#00111a",
  },
};

export function getServiceMeta(name = "") {
  const lower = name.toLowerCase();
  for (const key of Object.keys(SERVICE_META)) {
    if (lower.includes(key)) return SERVICE_META[key];
  }
  return SERVICE_META.default;
}
