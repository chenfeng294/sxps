const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'admin', 'src', 'pages');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 清理重复的 name 属性
  content = content.replace(/(name="[^"]+")\s+(name="[^"]+")/g, '$1');
  content = content.replace(/(autoComplete="[^"]+")\s+(autoComplete="[^"]+")/g, '$2');

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ 清理成功: ${filePath}`);
  }
}

const files = [
  'ProductList/index.tsx',
  'OrderList/index.tsx',
  'PurchaseList/index.tsx',
  'WarehouseList/index.tsx',
  'SortingList/index.tsx',
  'DeliveryList/index.tsx',
  'FinanceList/index.tsx',
  'CustomerList/index.tsx',
  'MarketingList/index.tsx',
  'SystemList/index.tsx',
  'Login/index.tsx',
  'MallList/index.tsx',
];

files.forEach(file => {
  const fullPath = path.join(pagesDir, file);
  processFile(fullPath);
});

console.log('\n✅ 所有页面清理完成！');
