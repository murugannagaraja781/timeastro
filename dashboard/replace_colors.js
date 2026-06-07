const fs = require('fs');
const path = require('path');

function replaceColorsInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // missing gray 50
    content = content.replace(/bg-(gray|slate|zinc|neutral|stone)-50\b/g, 'bg-white');

    // gradients
    content = content.replace(/from-(red|pink|indigo|purple|blue|green|emerald|teal|cyan|sky|rose|violet|fuchsia)-[0-9]{2,3}\b/g, 'from-orange-400');
    content = content.replace(/to-(red|pink|indigo|purple|blue|green|emerald|teal|cyan|sky|rose|violet|fuchsia)-[0-9]{2,3}\b/g, 'to-yellow-500');
    content = content.replace(/via-(red|pink|indigo|purple|blue|green|emerald|teal|cyan|sky|rose|violet|fuchsia)-[0-9]{2,3}\b/g, 'via-yellow-400');
    content = content.replace(/hover:from-(red|pink|indigo|purple|blue|green|emerald|teal|cyan|sky|rose|violet|fuchsia)-[0-9]{2,3}\b/g, 'hover:from-orange-500');
    content = content.replace(/hover:to-(red|pink|indigo|purple|blue|green|emerald|teal|cyan|sky|rose|violet|fuchsia)-[0-9]{2,3}\b/g, 'hover:to-yellow-600');

    // shadows
    content = content.replace(/shadow-(purple|indigo|blue|red|pink|green|emerald|teal|cyan|sky|rose|violet|fuchsia)-[0-9]{2,3}(\/[0-9]{1,2})?\b/g, 'shadow-orange-200');

    // specifically missed hexes
    content = content.replace(/bg-\[\#6366f1\]/g, 'bg-orange-500');
    content = content.replace(/hover:bg-\[\#4f46e5\]/g, 'hover:bg-orange-600');

    // missing text hover
    content = content.replace(/hover:text-(purple|blue|indigo|green|red|pink|emerald|cyan|teal|rose|sky)-[0-9]{2,3}\b/g, 'hover:text-black');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === 'out') continue;
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
                replaceColorsInFile(fullPath);
            }
        }
    }
}

walkDir(path.join(__dirname, 'pages'));
walkDir(path.join(__dirname, 'components'));
walkDir(path.join(__dirname, 'styles'));
