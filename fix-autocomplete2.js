const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'admin', 'src', 'pages');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 在Form标签级别添加 autoComplete="off"
  content = content.replace(
    /<Form([^>]*?)>/g,
    (match, attrs) => {
      if (attrs.includes('autoComplete')) {
        return match;
      }
      modified = true;
      return `<Form${attrs} autoComplete="off">`;
    }
  );

  // 修改 Input 标签，添加更严格的自动补全禁用
  content = content.replace(
    /<Input([^>]*?)\/>/g,
    (match, attrs) => {
      if (attrs.includes('autoComplete="new-password"')) {
        return match;
      }
      modified = true;
      const existingName = /name="([^"]+)"/.exec(attrs);
      const nameValue = existingName ? existingName[1] : 'input-' + Math.random().toString(36).substr(2, 9);
      return `<Input${attrs.replace(/autoComplete="off"/g, '')} autoComplete="new-password" name="${nameValue}" />`;
    }
  );

  // 修改 <Input ... ></Input> 形式
  content = content.replace(
    /<Input([^>]*?)>/g,
    (match, attrs) => {
      if (attrs.includes('autoComplete="new-password"')) {
        return match;
      }
      modified = true;
      const existingName = /name="([^"]+)"/.exec(attrs);
      const nameValue = existingName ? existingName[1] : 'input-' + Math.random().toString(36).substr(2, 9);
      return `<Input${attrs.replace(/autoComplete="off"/g, '')} autoComplete="new-password" name="${nameValue}">`;
    }
  );

  // 修改 Form.Item 标签，添加 autoComplete="off"
  content = content.replace(
    /<Form\.Item([^>]*?)>/g,
    (match, attrs) => {
      if (attrs.includes('autoComplete')) {
        return match;
      }
      modified = true;
      return `<Form.Item${attrs} autoComplete="off">`;
    }
  );

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ 修改成功: ${filePath}`);
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

console.log('\n✅ 所有页面修改完成！');
