const fs = require('fs');

const hexToRgb = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  return `${+r} ${+g} ${+b}`;
};

const colors = {
  "tertiary-container": "#a36700",
  "on-secondary-container": "#00714d",
  "tertiary-fixed-dim": "#ffb95f",
  "outline-variant": "#bdc9c5",
  "surface-bright": "#faf8ff",
  "on-tertiary-container": "#fffaf9",
  "tertiary": "#815100",
  "error-container": "#ffdad6",
  "surface": "#faf8ff",
  "secondary-container": "#6cf8bb",
  "secondary-fixed": "#6ffbbe",
  "primary-container": "#0d8275",
  "surface-tint": "#006b5f",
  "secondary-fixed-dim": "#4edea3",
  "on-primary-container": "#edfffa",
  "on-secondary": "#ffffff",
  "surface-container-highest": "#dae2fd",
  "surface-container-high": "#e2e7ff",
  "surface-dim": "#d2d9f4",
  "primary-fixed-dim": "#77d7c8",
  "surface-container-lowest": "#ffffff",
  "on-tertiary": "#ffffff",
  "surface-container": "#eaedff",
  "background": "#faf8ff",
  "on-primary-fixed-variant": "#005048",
  "on-background": "#131b2e",
  "surface-container-low": "#f2f3ff",
  "inverse-on-surface": "#eef0ff",
  "on-error-container": "#93000a",
  "inverse-primary": "#77d7c8",
  "error": "#ba1a1a",
  "primary-fixed": "#94f4e3",
  "on-surface": "#131b2e",
  "on-primary-fixed": "#00201c",
  "on-secondary-fixed-variant": "#005236",
  "on-secondary-fixed": "#002113",
  "on-error": "#ffffff",
  "on-primary": "#ffffff",
  "surface-variant": "#dae2fd",
  "on-surface-variant": "#3e4946",
  "on-tertiary-fixed-variant": "#653e00",
  "tertiary-fixed": "#ffddb8",
  "secondary": "#006c49",
  "on-tertiary-fixed": "#2a1700",
  "inverse-surface": "#283044",
  "outline": "#6e7a77",
  "primary": "#00675c"
};

const darkColors = { ...colors };

// Exact Stitch Dark Mode Reference Colors
darkColors["background"] = "#031427";
darkColors["surface-container-low"] = "#0b1c30";
darkColors["surface-container"] = "#102034";
darkColors["surface-container-high"] = "#1b2b3f";
darkColors["surface-container-highest"] = "#26364a";
darkColors["surface-bright"] = "#2a3a4f";
darkColors["on-surface"] = "#d3e4fe";
darkColors["on-surface-variant"] = "#bdc9c4";
darkColors["outline"] = "#87938e";
darkColors["outline-variant"] = "#3e4945";
darkColors["primary"] = "#7ad7be";
darkColors["primary-container"] = "#007a65";
darkColors["on-primary-container"] = "#a6ffe6";
darkColors["secondary"] = "#51dbc8";
darkColors["secondary-container"] = "#00b19f";
darkColors["error"] = "#ffb4ab";
darkColors["error-container"] = "#93000a";
darkColors["tertiary"] = "#ffb783";

// Map related surface colors to maintain logical hierarchy if not explicitly provided
darkColors["surface"] = "#031427"; // Same as background often in material design, or low
darkColors["surface-container-lowest"] = "#031427"; 
darkColors["surface-dim"] = "#020e1c"; // Slightly darker than background
darkColors["surface-variant"] = "#1b2b3f"; // Matches high

// Map related text colors
darkColors["on-background"] = "#d3e4fe";
darkColors["inverse-surface"] = "#d3e4fe";
darkColors["inverse-on-surface"] = "#031427";

let cssRoot = ":root {\\n";
let cssDark = ".dark {\\n";

for (const [key, value] of Object.entries(colors)) {
  const cssVar = `--color-${key}`;
  cssRoot += `  ${cssVar}: ${hexToRgb(value)};\\n`;
  cssDark += `  ${cssVar}: ${hexToRgb(darkColors[key] || value)};\\n`;
}
cssRoot += "}\\n\\n";
cssDark += "}\\n";

const newCss = cssRoot + cssDark;

let indexCss = fs.readFileSync('d:/Neeramoy/frontend/src/index.css', 'utf8');
indexCss = indexCss.replace(/:root {[\\s\\S]*?}\\n\\n\\.dark {[\\s\\S]*?}\\n/, '');
if (!indexCss.includes(':root {')) {
    indexCss = indexCss.replace('@tailwind utilities;', '@tailwind utilities;\\n\\n' + newCss);
}
fs.writeFileSync('d:/Neeramoy/frontend/src/index.css', indexCss);
