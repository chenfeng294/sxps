const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend/admin/src/pages');

const directories = [
  'OrderList',
  'PurchaseList',
  'WarehouseList',
  'SortingList',
  'DeliveryList',
  'CustomerList',
  'MarketingList',
  'SystemList'
];

directories.forEach((dir) => {
  const filePath = path.join(pagesDir, dir, 'index.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. 移除 message 从导入中
    content = content.replace(
      /import \{([^}]*)(message,?\s*)([^}]*)\}/,
      (match, before, msg, after) => {
        // 移除message并处理逗号
        let newImport = before + after;
        newImport = newImport.replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '');
        return `import {${newImport}}`;
      }
    );
    
    // 2. 替换所有 message.error 为 console.error
    content = content.replace(/message\.error\(['"]([^'"]+)['"]\)/g, 'console.error(\'$1\', error)');
    content = content.replace(/message\.error\(([^)]+)\)/g, 'console.error($1, error)');
    
    // 3. 替换所有 message.success 为 console.log
    content = content.replace(/message\.success\(['"]([^'"]+)['"]\)/g, 'console.log(\'$1\')');
    content = content.replace(/message\.success\(([^)]+)\)/g, 'console.log($1)');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Modified: ${filePath}`);
  }
});

console.log('All files processed!');
