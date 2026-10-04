const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const urlToReplace = 'https://lh3.googleusercontent.com/aida/AEtjO1WevWq68kahKBgmF-DHxxsQi68HIUK_Skiskpaf1OD1uWIsR0J5srB6HNv5Dd8Pcz9G5gdHmnkF227BBj4IPzh1V0F2PPqLZnHYdGw9RZmh-xAKbdPkH9p3nb7u9t4W6Ipq5swim3rh3lXigrlPzZD8s36VCiY5y-133nBsyQY9Ifn-0paSzSHlD8Uady3B6vdQXGAxuG-fv61GTe37U2sC4qUA86rOLVx-G9f72hdcee3ymrasQg6VYKM';

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(urlToReplace)) {
                content = content.replace(new RegExp(urlToReplace.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '/logo.png');
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDir(srcDir);
