const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'admin', 'src', 'pages');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 处理 Input 标签中的重复属性
  content = content.replace(
    /<Input([^>]*)>/g,
    (match, attrs) => {
      // 提取 name 和 autoComplete 属性
      const nameMatches = attrs.match(/name="([^"]+)"/g) || [];
      const autoCompleteMatches = attrs.match(/autoComplete="([^"]+)"/g) || [];
      
      let newAttrs = attrs;
      
      // 如果有多个 name，只保留最后一个
      if (nameMatches.length > 1) {
        // 移除所有 name 属性
        newAttrs = newAttrs.replace(/\s*name="[^"]+"/g, '');
        // 添加最后一个
        newAttrs += ' ' + nameMatches[nameMatches.length - 1];
      }
      
      // 如果有多个 autoComplete，只保留最后一个
      if (autoCompleteMatches.length > 1) {
        // 移除所有 autoComplete 属性
        newAttrs = newAttrs.replace(/\s*autoComplete="[^"]+"/g, '');
        // 添加最后一个
        newAttrs += ' ' + autoCompleteMatches[autoCompleteMatches.length - 1];
      }
      
      // 清理多余空格
      newAttrs = newAttrs.replace(/\s+/g, ' ').trim();
      
      if (newAttrs !== attrs) {
        return `<Input${newAttrs}>`;
      }
      return match;
    }
  );

  // 处理 Input 自闭合标签
  content = content.replace(
    /<Input([^>]*)\/>/g,
    (match, attrs) => {
      const nameMatches = attrs.match(/name="([^"]+)"/g) || [];
      const autoCompleteMatches = attrs.match(/autoComplete="([^"]+)"/g) || [];
      
      let newAttrs = attrs;
      
      if (nameMatches.length > 1) {
        newAttrs = newAttrs.replace(/\s*name="[^"]+"/g, '');
        newAttrs += ' ' + nameMatches[nameMatches.length - 1];
      }
      
      if (autoCompleteMatches.length > 1) {
        newAttrs = newAttrs.replace(/\s*autoComplete="[^"]+"/g, '');
        newAttrs += ' ' + autoCompleteMatches[autoCompleteMatches.length - 1];
      }
      
      newAttrs = newAttrs.replace(/\s+/g, ' ').trim();
      
      if (newAttrs !== attrs) {
        return `<Input${newAttrs} />`;
      }
      return match;
    }
  );

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
