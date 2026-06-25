const fs = require('fs');
const https = require('https');

https.get('https://tribetoy.in', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const links = [...data.matchAll(/href=["'](\/.*?)["']/g)].map(m => m[1]);
        const uniqueLinks = Array.from(new Set(links));
        console.log("All unique relative links:");
        console.log(uniqueLinks.filter(l => l.includes('blog') || l.includes('news') || l.includes('event')));
    });
}).on('error', err => console.log('Error: ', err.message));
