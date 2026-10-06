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

const exactStitchDarkColors = {
  "on-primary":"#00382d",
  "on-tertiary-container":"#ffeadd",
  "on-secondary-container":"#003d36",
  "surface":"#031427",
  "on-error-container":"#ffdad6",
  "on-surface":"#d3e4fe",
  "surface-container":"#102034",
  "tertiary-fixed":"#ffdcc5",
  "primary-container":"#007a65",
  "error":"#ffb4ab",
  "secondary-fixed":"#72f8e4",
  "surface-bright":"#2a3a4f",
  "on-secondary-fixed":"#00201c",
  "on-error":"#690005",
  "surface-tint":"#7ad7be",
  "on-primary-container":"#a6ffe6",
  "on-secondary-fixed-variant":"#005047",
  "secondary":"#51dbc8",
  "primary":"#7ad7be",
  "inverse-primary":"#006b58",
  "tertiary-fixed-dim":"#ffb783",
  "primary-fixed":"#96f4da",
  "on-surface-variant":"#bdc9c4",
  "outline-variant":"#3e4945",
  "error-container":"#93000a",
  "secondary-container":"#00b19f",
  "tertiary-container":"#a85500",
  "on-primary-fixed":"#002019",
  "surface-container-lowest":"#000f21",
  "surface-container-highest":"#26364a",
  "background":"#031427",
  "primary-fixed-dim":"#7ad7be",
  "surface-container-low":"#0b1c30",
  "tertiary":"#ffb783",
  "on-tertiary-fixed-variant":"#713700",
  "inverse-surface":"#d3e4fe",
  "on-tertiary":"#4f2500",
  "on-secondary":"#003731",
  "surface-dim":"#031427",
  "outline":"#87938e",
  "surface-variant":"#26364a",
  "surface-container-high":"#1b2b3f",
  "on-tertiary-fixed":"#301400",
  "on-primary-fixed-variant":"#005142",
  "secondary-fixed-dim":"#51dbc8",
  "inverse-on-surface":"#213145"
};

let cssDark = ".dark {\\n";
for (const [key, value] of Object.entries(exactStitchDarkColors)) {
  const cssVar = `--color-${key}`;
  cssDark += `  ${cssVar}: ${hexToRgb(value)};\\n`;
}
cssDark += "}\\n";

let indexCss = fs.readFileSync('d:/Neeramoy/frontend/src/index.css', 'utf8');

// Replace everything between .dark { and } with the new correct block
const newIndexCss = indexCss.replace(/\\.dark {[\\s\\S]*?\\}/, cssDark);

fs.writeFileSync('d:/Neeramoy/frontend/src/index.css', newIndexCss);
