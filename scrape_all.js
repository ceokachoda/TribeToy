const https = require('https');
const fs = require('fs');

const allProducts = [];
let currentPage = 1;
const maxPages = 5;

function fetchPage(page) {
    const url = page === 1 ? 'https://thetribetoy.com/shop/' : `https://thetribetoy.com/shop/page/${page}/`;
    console.log(`Fetching ${url}...`);
    
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive'
        }
    };

    https.get(url, options, (res) => {
        if (res.statusCode !== 200) {
            console.log(`Page ${page} returned ${res.statusCode}. Finished scraping.`);
            finishScraping();
            return;
        }

        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            const productBlocks = data.split('<li class="product');
            productBlocks.shift();
            
            if (productBlocks.length === 0) {
                console.log(`No products found on page ${page}. Finished scraping.`);
                finishScraping();
                return;
            }

            productBlocks.forEach(block => {
                try {
                    const urlMatch = block.match(/href="(https:\/\/thetribetoy\.com\/product\/[^"]+)"/);
                    const titleMatch = block.match(/<h2 class="woocommerce-loop-product__title">(.*?)<\/h2>/);
                    const priceMatch = block.match(/<bdi>.*?;(.*?)<\/bdi>/g); 
                    const price = priceMatch ? priceMatch[priceMatch.length - 1].replace(/<[^>]+>/g, '').replace(';', '') : "N/A";
                    
                    const imgMatch = block.match(/<img[^>]+src="(https:\/\/thetribetoy\.com\/wp-content\/uploads\/[^"]+)"/);
                    const classMatch = block.match(/class="[^"]*product_cat-([^ "\n]+)/);
                    const category = classMatch ? classMatch[1].replace(/-/g, ' ') : "Toy";

                    if (titleMatch && urlMatch) {
                        const name = titleMatch[1].trim();
                        if (!allProducts.find(p => p.name === name)) {
                            allProducts.push({
                                id: allProducts.length + 1,
                                name: name,
                                url: urlMatch[1],
                                price: "₹" + price.replace(/[^0-9.]/g, ''),
                                image: imgMatch ? imgMatch[1] : "",
                                category: category.charAt(0).toUpperCase() + category.slice(1)
                            });
                        }
                    }
                } catch (e) {
                    // Ignore errors
                }
            });

            if (page < maxPages) {
                fetchPage(page + 1);
            } else {
                finishScraping();
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        finishScraping();
    });
}

function finishScraping() {
    console.log(`Successfully scraped ${allProducts.length} products!`);
    fs.writeFileSync('src/data/products.ts', `export const products = ${JSON.stringify(allProducts, null, 2)};\n`);
    console.log('Saved to src/data/products.ts');
}

fetchPage(1);
