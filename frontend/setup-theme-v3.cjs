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
// Map the core backgrounds
darkColors["background"] = "#0d1117"; 
darkColors["surface"] = "#0d1117";
darkColors["surface-bright"] = "#161b22";
darkColors["surface-container-lowest"] = "#0d1117";
darkColors["surface-container-low"] = "#161b22";
darkColors["surface-container"] = "#21262d";
darkColors["surface-container-high"] = "#30363d";
darkColors["surface-container-highest"] = "#484f58";
darkColors["surface-dim"] = "#010409";
darkColors["surface-variant"] = "#30363d";
darkColors["inverse-surface"] = "#e6edf3";

// Map text
darkColors["on-background"] = "#e6edf3";
darkColors["on-surface"] = "#e6edf3";
darkColors["on-surface-variant"] = "#8b949e";
darkColors["inverse-on-surface"] = "#0d1117";

// Map borders
darkColors["outline"] = "#8b949e";
darkColors["outline-variant"] = "#30363d";

// Primary adjustments (Teal preserved but brightened for contrast)
darkColors["primary"] = "#4fd1c5";
darkColors["primary-container"] = "#004e46";
darkColors["on-primary-container"] = "#e6edf3";
darkColors["inverse-primary"] = "#00675c";

let tailwindColors = {};
let cssRoot = ":root {\\n";
let cssDark = ".dark {\\n";

for (const [key, value] of Object.entries(colors)) {
  const cssVar = `--color-${key}`;
  tailwindColors[key] = `rgb(var(${cssVar}) / <alpha-value>)`;
  cssRoot += `  ${cssVar}: ${hexToRgb(value)};\\n`;
  cssDark += `  ${cssVar}: ${hexToRgb(darkColors[key] || value)};\\n`;
}
cssRoot += "}\\n\\n";
cssDark += "}\\n";

const newCss = cssRoot + cssDark;

const tailwindConfig = fs.readFileSync('d:/Neeramoy/frontend/tailwind.config.js', 'utf8');
const newTailwind = tailwindConfig.replace(/colors: {[\\s\\S]*?},/, 'colors: ' + JSON.stringify(tailwindColors, null, 2).replace(/\"/g, "'") + ',');
fs.writeFileSync('d:/Neeramoy/frontend/tailwind.config.js', newTailwind);

let indexCss = fs.readFileSync('d:/Neeramoy/frontend/src/index.css', 'utf8');
indexCss = indexCss.replace(/:root {[\\s\\S]*?}\\n\\n\\.dark {[\\s\\S]*?}\\n/, '');
if (!indexCss.includes(':root {')) {
    indexCss = indexCss.replace('@tailwind utilities;', '@tailwind utilities;\\n\\n' + newCss);
}
fs.writeFileSync('d:/Neeramoy/frontend/src/index.css', indexCss);
