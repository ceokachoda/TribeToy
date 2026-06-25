const fs = require('fs');
const html = fs.readFileSync('C:\\\\Users\\\\Karan\\\\.gemini\\\\antigravity-ide\\\\brain\\\\b67ad9a9-f411-4a05-983b-a8b5516026ee\\\\.system_generated\\\\steps\\\\781\\\\content.md', 'utf8');

const titleMatches = [...html.matchAll(/woocommerce-loop-product__title[^>]*>(.*?)</g)];
const titles = titleMatches.map(m => m[1]);
console.log("Titles:", new Set(titles));

const linkMatches = [...html.matchAll(/href="(https:\/\/thetribetoy\.com\/product\/[^"]+)"/g)];
const links = linkMatches.map(m => m[1]);
console.log("Links:");
[...new Set(links)].forEach(l => console.log(l));
