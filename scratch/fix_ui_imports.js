const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, '../src/components/ui');
const files = fs.readdirSync(uiDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let fixedCount = 0;
for (const file of files) {
  const filePath = path.join(uiDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  // Match (@scope/pkg or pkg) followed by @version inside quotes:
  // e.g. from "@radix-ui/react-dialog@1.1.6" -> from "@radix-ui/react-dialog"
  // e.g. from "lucide-react@0.487.0" -> from "lucide-react"
  const newContent = content.replace(/(from\s+['"])([^'"]+?)@\d+\.\d+(?:\.\d+)?(['"])/g, '$1$2$3');
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Fixed imports in ${file}`);
    fixedCount++;
  }
}
console.log(`Finished fixing ${fixedCount} UI files.`);
