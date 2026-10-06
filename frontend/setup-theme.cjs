
const fs = require('fs');

const tailwindConfig = fs.readFileSync('d:/Neeramoy/frontend/tailwind.config.js', 'utf8');
const newColors = {
  "tertiary-container": "var(--color-tertiary-container)",
  "on-secondary-container": "var(--color-on-secondary-container)",
  "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim)",
  "outline-variant": "var(--color-outline-variant)",
  "surface-bright": "var(--color-surface-bright)",
  "on-tertiary-container": "var(--color-on-tertiary-container)",
  "tertiary": "var(--color-tertiary)",
  "error-container": "var(--color-error-container)",
  "surface": "var(--color-surface)",
  "secondary-container": "var(--color-secondary-container)",
  "secondary-fixed": "var(--color-secondary-fixed)",
  "primary-container": "var(--color-primary-container)",
  "surface-tint": "var(--color-surface-tint)",
  "secondary-fixed-dim": "var(--color-secondary-fixed-dim)",
  "on-primary-container": "var(--color-on-primary-container)",
  "on-secondary": "var(--color-on-secondary)",
  "surface-container-highest": "var(--color-surface-container-highest)",
  "surface-container-high": "var(--color-surface-container-high)",
  "surface-dim": "var(--color-surface-dim)",
  "primary-fixed-dim": "var(--color-primary-fixed-dim)",
  "surface-container-lowest": "var(--color-surface-container-lowest)",
  "on-tertiary": "var(--color-on-tertiary)",
  "surface-container": "var(--color-surface-container)",
  "background": "var(--color-background)",
  "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant)",
  "on-background": "var(--color-on-background)",
  "surface-container-low": "var(--color-surface-container-low)",
  "inverse-on-surface": "var(--color-inverse-on-surface)",
  "on-error-container": "var(--color-on-error-container)",
  "inverse-primary": "var(--color-inverse-primary)",
  "error": "var(--color-error)",
  "primary-fixed": "var(--color-primary-fixed)",
  "on-surface": "var(--color-on-surface)",
  "on-primary-fixed": "var(--color-on-primary-fixed)",
  "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
  "on-secondary-fixed": "var(--color-on-secondary-fixed)",
  "on-error": "var(--color-on-error)",
  "on-primary": "var(--color-on-primary)",
  "surface-variant": "var(--color-surface-variant)",
  "on-surface-variant": "var(--color-on-surface-variant)",
  "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant)",
  "tertiary-fixed": "var(--color-tertiary-fixed)",
  "secondary": "var(--color-secondary)",
  "on-tertiary-fixed": "var(--color-on-tertiary-fixed)",
  "inverse-surface": "var(--color-inverse-surface)",
  "outline": "var(--color-outline)",
  "primary": "var(--color-primary)"
};

// Replace the colors block
const newTailwind = tailwindConfig.replace(/colors: {[\s\S]*?},/, 'colors: ' + JSON.stringify(newColors, null, 2).replace(/"/g, "'") + ',');
fs.writeFileSync('d:/Neeramoy/frontend/tailwind.config.js', newTailwind);

let indexCss = fs.readFileSync('d:/Neeramoy/frontend/src/index.css', 'utf8');
indexCss = indexCss.replace('@tailwind utilities;', '@tailwind utilities;\n\n' + `:root {
  --color-tertiary-container: #a36700;
  --color-on-secondary-container: #00714d;
  --color-tertiary-fixed-dim: #ffb95f;
  --color-outline-variant: #bdc9c5;
  --color-surface-bright: #faf8ff;
  --color-on-tertiary-container: #fffaf9;
  --color-tertiary: #815100;
  --color-error-container: #ffdad6;
  --color-surface: #faf8ff;
  --color-secondary-container: #6cf8bb;
  --color-secondary-fixed: #6ffbbe;
  --color-primary-container: #0d8275;
  --color-surface-tint: #006b5f;
  --color-secondary-fixed-dim: #4edea3;
  --color-on-primary-container: #edfffa;
  --color-on-secondary: #ffffff;
  --color-surface-container-highest: #dae2fd;
  --color-surface-container-high: #e2e7ff;
  --color-surface-dim: #d2d9f4;
  --color-primary-fixed-dim: #77d7c8;
  --color-surface-container-lowest: #ffffff;
  --color-on-tertiary: #ffffff;
  --color-surface-container: #eaedff;
  --color-background: #faf8ff;
  --color-on-primary-fixed-variant: #005048;
  --color-on-background: #131b2e;
  --color-surface-container-low: #f2f3ff;
  --color-inverse-on-surface: #eef0ff;
  --color-on-error-container: #93000a;
  --color-inverse-primary: #77d7c8;
  --color-error: #ba1a1a;
  --color-primary-fixed: #94f4e3;
  --color-on-surface: #131b2e;
  --color-on-primary-fixed: #00201c;
  --color-on-secondary-fixed-variant: #005236;
  --color-on-secondary-fixed: #002113;
  --color-on-error: #ffffff;
  --color-on-primary: #ffffff;
  --color-surface-variant: #dae2fd;
  --color-on-surface-variant: #3e4946;
  --color-on-tertiary-fixed-variant: #653e00;
  --color-tertiary-fixed: #ffddb8;
  --color-secondary: #006c49;
  --color-on-tertiary-fixed: #2a1700;
  --color-inverse-surface: #283044;
  --color-outline: #6e7a77;
  --color-primary: #00675c;
}

.dark {
  --color-tertiary-container: #a36700;
  --color-on-secondary-container: #00714d;
  --color-tertiary-fixed-dim: #ffb95f;
  --color-outline-variant: #30363d;
  --color-surface-bright: #161b22;
  --color-on-tertiary-container: #fffaf9;
  --color-tertiary: #815100;
  --color-error-container: #ffdad6;
  --color-surface: #0d1117;
  --color-secondary-container: #6cf8bb;
  --color-secondary-fixed: #6ffbbe;
  --color-primary-container: #004e46;
  --color-surface-tint: #006b5f;
  --color-secondary-fixed-dim: #4edea3;
  --color-on-primary-container: #e6edf3;
  --color-on-secondary: #ffffff;
  --color-surface-container-highest: #484f58;
  --color-surface-container-high: #30363d;
  --color-surface-dim: #010409;
  --color-primary-fixed-dim: #77d7c8;
  --color-surface-container-lowest: #0d1117;
  --color-on-tertiary: #ffffff;
  --color-surface-container: #21262d;
  --color-background: #0d1117;
  --color-on-primary-fixed-variant: #005048;
  --color-on-background: #e6edf3;
  --color-surface-container-low: #161b22;
  --color-inverse-on-surface: #0d1117;
  --color-on-error-container: #93000a;
  --color-inverse-primary: #00675c;
  --color-error: #ba1a1a;
  --color-primary-fixed: #94f4e3;
  --color-on-surface: #e6edf3;
  --color-on-primary-fixed: #00201c;
  --color-on-secondary-fixed-variant: #005236;
  --color-on-secondary-fixed: #002113;
  --color-on-error: #ffffff;
  --color-on-primary: #ffffff;
  --color-surface-variant: #30363d;
  --color-on-surface-variant: #8b949e;
  --color-on-tertiary-fixed-variant: #653e00;
  --color-tertiary-fixed: #ffddb8;
  --color-secondary: #006c49;
  --color-on-tertiary-fixed: #2a1700;
  --color-inverse-surface: #e6edf3;
  --color-outline: #8b949e;
  --color-primary: #4fd1c5;
}
`);
fs.writeFileSync('d:/Neeramoy/frontend/src/index.css', indexCss);

console.log('Theme setup complete!');
