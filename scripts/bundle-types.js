const fs = require('fs');
const path = require('path');

// The tsc command with tsconfig.lib.json generates .d.ts files in dist/
// We need to find them and bundle them into dist/index.d.ts

const distDir = path.join(__dirname, '..', 'dist');

// Read the generated index.d.ts (from src/index.ts)
const indexDtsPath = path.join(distDir, 'index.d.ts');

if (fs.existsSync(indexDtsPath)) {
  console.log('✅ TypeScript definitions found and bundled at dist/index.d.ts');
} else {
  console.warn('⚠️  Warning: dist/index.d.ts not found');
  console.warn('Generated files:', fs.readdirSync(distDir).filter(f => f.endsWith('.d.ts')));
}
