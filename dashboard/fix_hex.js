const fs = require('fs');
const path = require('path');

const hexMap = {
    '#1a1060': '#fef08a',
    '#040212': '#f59e0b',
    '#4c2d8a': '#d97706',
    '#7c3aed': '#fbbf24',
    '#a78bfa': '#fde047',
    '#c4b5fd': '#000000',
    '#4c1d95': '#b45309',
    '#0d0830': '#fef08a',
    '#020110': '#f59e0b',
    '#f87171': '#f97316',
    '#e2e8f0': '#fef9c3',
    '#0a0520': '#ffffff',
    '#fafafa': '#ffffff',
    '#5b21b6': '#d97706',
    '#2e1065': '#fcd34d',
    '#c084fc': '#fde047',
};

function replaceHexInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const [badHex, goodHex] of Object.entries(hexMap)) {
        // Global case-insensitive replacement
        const regex = new RegExp(badHex, 'gi');
        content = content.replace(regex, goodHex);
    }
    
    // Also catch some stray text classes
    content = content.replace(/text-\[\#5b21b6\]/g, 'text-orange-500');
    content = content.replace(/hover:text-\[\#5b21b6\]/g, 'hover:text-orange-600');
    content = content.replace(/bg-\[\#0a0520\]/g, 'bg-white');
    content = content.replace(/bg-\[\#fafafa\]/g, 'bg-white');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Hex updated:', filePath);
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
                replaceHexInFile(fullPath);
            }
        }
    }
}

walkDir(path.join(__dirname, 'pages'));
walkDir(path.join(__dirname, 'components'));
walkDir(path.join(__dirname, 'styles'));
