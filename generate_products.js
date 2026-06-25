const fs = require('fs');

const extractedProducts = [
  { name: '3D Printed Assamese Fantasy Figurine The Regal Dragon', cat: 'Toys & Figurines', price: 399 },
  { name: '3D Printed Assamese Souvenir Dhol Pepa Japi Xorai Ensemble', cat: 'Cultural', price: 499 },
  { name: '3D Printed BerryBear Eco Friendly Biopolymer Teddy', cat: 'Toys & Figurines', price: 599 },
  { name: '3D Printed Cartoon Figurine Sponge Bob On The Beach', cat: 'Toys & Figurines', price: 349 },
  { name: '3D Printed Counting Puzzle How Many Educational Board', cat: 'Educational', price: 299 },
  { name: '3D Printed Custom Photo Frame Summer Camp Memory Frame', cat: 'Utility & Decor', price: 449 },
  { name: '3D Printed Decor Figurine Geometric Panther', cat: 'Utility & Decor', price: 699 },
  { name: '3D Printed Educational Puzzle Owl Shape Assembly Board', cat: 'Educational', price: 399 },
  { name: '3D Printed Looney Tunes Figurine Daffy Duck In Streetwear', cat: 'Toys & Figurines', price: 449 },
  { name: '3D Printed Moon Lamp Night Glow Jupiter Lamp', cat: 'Utility & Decor', price: 899 },
  { name: '3D Printed Superhero Figurine Deadpool Inspired', cat: 'Toys & Figurines', price: 799 },
  { name: '3D Printed Tribute Figurine Atal Bihari Vajpayee', cat: 'Cultural', price: 999 },
];

const categories = ['Cultural', 'Educational', 'Statues', 'Toys & Figurines', 'Utility & Decor'];

const products = [];

// Add extracted 12
extractedProducts.forEach((p, i) => {
  products.push({
    id: i + 1,
    name: p.name,
    category: p.cat,
    price: `₹${p.price}.00`,
    image: '', // Will use a neutral placeholder fallback in UI
    isNew: i % 3 === 0,
    isSale: i % 4 === 0
  });
});

// Generate remaining 33 to hit exactly 45
for (let i = 13; i <= 45; i++) {
  // Distribute categories
  let cat = categories[Math.floor(Math.random() * categories.length)];
  products.push({
    id: i,
    name: `Premium 3D Printed Product ${i}`,
    category: cat,
    price: `₹${Math.floor(Math.random() * 500 + 300)}.00`,
    image: '',
    isNew: i % 7 === 0,
    isSale: i % 9 === 0
  });
}

const fileContent = `export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  isPremium?: boolean;
};

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/products.ts', fileContent);
console.log('Successfully generated src/data/products.ts with 45 products.');
