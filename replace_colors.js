const fs = require('fs');
const path = require('path');

function replaceInFolder(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFolder(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            
            // Hardcoded dark backgrounds -> semantic
            content = content.replace(/bg-\[#0a0a0b\]/g, 'bg-background');
            content = content.replace(/bg-\[#020617\]/g, 'bg-background');
            content = content.replace(/bg-\[#0a0f1a\]/g, 'bg-card');
            
            // Translucent whites -> semantic secondary / border
            content = content.replace(/bg-white\/5/g, 'bg-secondary/50');
            content = content.replace(/bg-white\/10/g, 'bg-secondary');
            content = content.replace(/bg-white\/20/g, 'bg-secondary/80');
            
            content = content.replace(/border-white\/5/g, 'border-border/50');
            content = content.replace(/border-white\/10/g, 'border-border');
            content = content.replace(/border-white\/20/g, 'border-border');
            
            // Text colors
            content = content.replace(/text-white\/60/g, 'text-muted-foreground');
            content = content.replace(/text-white\/70/g, 'text-muted-foreground');
            content = content.replace(/text-white\/40/g, 'text-muted-foreground/50');
            
            // Avoid replacing text-white inside comments or specific areas if string matches
            content = content.replace(/text-white /g, 'text-foreground ');
            content = content.replace(/text-white"/g, 'text-foreground"');
            
            if (original !== content) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated: ' + fullPath);
            }
        }
    });
}

replaceInFolder(path.join(__dirname, 'src'));
