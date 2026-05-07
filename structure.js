const fs = require('fs');
const path = require('path');

function printTree(dir, prefix = '', ignore = ['node_modules', '.git', 'dist', 'build']) {
  try {
    const items = fs.readdirSync(dir);
    items.forEach((item, index) => {
      if (ignore.includes(item)) return;
      const fullPath = path.join(dir, item);
      const isLast = index === items.length - 1;
      console.log(prefix + (isLast ? '└── ' : '├── ') + item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        printTree(fullPath, prefix + (isLast ? '    ' : '│   '), ignore);
      }
    });
  } catch (err) {}
}

printTree('.');