const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'dashboard', 'out');
const oldNextDir = path.join(outDir, '_next');
const newNextDir = path.join(outDir, 'assets');

if (fs.existsSync(oldNextDir)) {
    fs.renameSync(oldNextDir, newNextDir);
    console.log('Renamed _next to assets');
}

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else {
            const ext = path.extname(file);
            if (['.html', '.js', '.css', '.json'].includes(ext) || file === '.htaccess') {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content.replace(/\/_next\//g, '/assets/');
                newContent = newContent.replace(/%2F_next%2F/g, '%2Fassets%2F');
                
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log('Updated references in:', file);
                }
            }
        }
    }
}

replaceInFiles(outDir);
console.log('Done replacing references.');
