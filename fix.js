const fs = require('fs');
let c = fs.readFileSync('src/app/product/[id]/page.tsx', 'utf8');
c = c.replace('<h3 className="fw-bold mb-2 text-dark">{product.name}</h3>', '<h3 className="fw-bold mb-2 text-dark text-capitalize">{product.name}</h3>');
c = c.replace('<li className="breadcrumb-item active text-dark fw-medium" aria-current="page">{product.name}</li>', '<li className="breadcrumb-item active text-dark fw-medium text-capitalize" aria-current="page">{product.name}</li>');
fs.writeFileSync('src/app/product/[id]/page.tsx', c);
console.log('Fixed');
