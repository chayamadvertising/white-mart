const fs = require('fs');
let c = fs.readFileSync('src/app/product/[id]/page.tsx', 'utf8');
c = c.replace("import AddToCartButton from './AddToCartButton'", "import AddToCartButton from './AddToCartButton'\nimport BuyNowButton from './BuyNowButton'");
c = c.replace(/<Link href="\/checkout"[\s\S]*?BUY NOW[\s\S]*?<\/Link>/m, '<BuyNowButton product={product} />');
fs.writeFileSync('src/app/product/[id]/page.tsx', c);
console.log('Fixed BuyNow');
