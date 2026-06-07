const fs = require('fs');
const html = fs.readFileSync('live_html.txt', 'utf8');
const matches = html.match(/href="([^"]+\.css)"/g);
console.log(matches);
