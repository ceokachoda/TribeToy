const https = require('https');

https.get('https://thetribetoy.com/shop/', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        // Extract all products
        const products = [];
        
        // Let's use regex to find each product block
        const productBlocks = data.split('<li class="product');
        productBlocks.shift(); // remove first part before any product
        
        productBlocks.forEach(block => {
            try {
                const urlMatch = block.match(/href="(https:\/\/thetribetoy\.com\/product\/[^"]+)"/);
                const titleMatch = block.match(/<h2 class="woocommerce-loop-product__title">(.*?)<\/h2>/);
                const priceMatch = block.match(/<span class="woocommerce-Price-amount amount">.*?;(.*?)<\/span>/) || block.match(/<bdi>.*?;(.*?)<\/bdi>/);
                const imgMatch = block.match(/<img[^>]+src="(https:\/\/thetribetoy\.com\/wp-content\/uploads\/[^"]+)"/);
                const categoryMatch = block.match(/<span class="product-category">.*?<a[^>]*>(.*?)<\/a>/) || ["", "Toy"];

                if (titleMatch && urlMatch) {
                    products.push({
                        name: titleMatch[1].trim(),
                        url: urlMatch[1],
                        price: priceMatch ? priceMatch[1] : "N/A",
                        image: imgMatch ? imgMatch[1] : "",
                        category: categoryMatch[1].trim()
                    });
                }
            } catch (e) {
                console.error("Error parsing block");
            }
        });
        
        console.log(JSON.stringify(products, null, 2));
        require('fs').writeFileSync('scraped_products.json', JSON.stringify(products, null, 2));
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
