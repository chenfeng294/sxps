const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'admin', 'src', 'pages');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 清理重复的 name 属性
  content = content.replace(/<Input([^>]*)name="([^"]+)"\s+name="[^"]+"([^>]*)\/>/g, '<Input$1name="$2"$3 />');
  content = content.replace(/<Input([^>]*)name="([^"]+)"\s+name="[^"]+"([^>]*)>/g, '<Input$1name="$2"$3>');

  // 清理重复的 autoComplete 属性
  content = content.replace(/<Input([^>]*)autoComplete="[^"]+"\s+autoComplete="([^"]+)"([^>]*)\/>/g, '<Input$1autoComplete="$2"$3 />');
  content = content.replace(/<Input([^>]*)autoComplete="[^"]+"\s+autoComplete="([^"]+)"([^>]*)>/g, '<Input$1autoComplete="$2"$3>');

  // 清理多余的空格
  content = content.replace(/<Input([^>]*)  +([^>]*)>/g, '<Input$1 $2>');
  content = content.replace(/<Input([^>]*)  +([^>]*)\/>/g, '<Input$1 $2 />');

  if (content !== originalContent) {
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
