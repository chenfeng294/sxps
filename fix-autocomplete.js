const fs = require('fs')
const path = require('path')

const pagesDir = path.join(__dirname, 'frontend', 'admin', 'src', 'pages')

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return

  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  // 修改 <Input ... /> 没有 autoComplete 的
  content = content.replace(
    /<Input([^>]*?)\/>/g,
    (match, attrs) => {
      if (attrs.includes('autoComplete')) {
        return match
      }
      modified = true
      const nameAttr = /name="([^"]+)"/.exec(attrs) || /placeholder="([^"]+)"/.exec(attrs)
      const nameValue = nameAttr ? nameAttr[1].replace(/\s/g, '-').toLowerCase() : 'input'
      return `<Input${attrs} autoComplete="off" name="${nameValue}" />`
    }
  )

  // 修改 <Input ... ></Input> 没有 autoComplete 的
  content = content.replace(
    /<Input([^>]*?)>/g,
    (match, attrs) => {
      if (attrs.includes('autoComplete')) {
        return match
      }
      modified = true
      const nameAttr = /name="([^"]+)"/.exec(attrs) || /placeholder="([^"]+)"/.exec(attrs)
      const nameValue = nameAttr ? nameAttr[1].replace(/\s/g, '-').toLowerCase() : 'input'
      return `<Input${attrs} autoComplete="off" name="${nameValue}">`
    }
  )

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✓ 修改成功: ${filePath}`)
  }
}

const files = [
  'OrderList/index.tsx',
  'PurchaseList/index.tsx',
  'WarehouseList/index.tsx',
  'SortingList/index.tsx',
  'DeliveryList/index.tsx',
  'CustomerList/index.tsx',
  'MarketingList/index.tsx',
  'SystemList/index.tsx',
  'FinanceList/index.tsx',
  'Login/index.tsx',
  'MallList/index.tsx'
]

files.forEach(file => {
  const fullPath = path.join(pagesDir, file)
  processFile(fullPath)
})

console.log('\n✅ 所有页面修改完成！')
