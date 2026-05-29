const fs = require('fs');
const path = require('path');

const adminPath = 'c:\\Users\\user\\Downloads\\Projects\\Cradera\\MVP\\client\\src\\pages\\admin';
const files = fs.readdirSync(adminPath).filter(f => f.endsWith('.jsx'));

files.forEach(filename => {
    const fullPath = path.join(adminPath, filename);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Simple comment removal
    content = content.replace(/\/\/.*$/gm, '');
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    const count = (char) => (content.split(char).length - 1);

    const braceO = count('{');
    const braceC = count('}');
    if (braceO !== braceC) console.log(`${filename}: Braces unbalanced! {:${braceO}, }:${braceC}`);

    const tagO = count('<');
    const tagC = count('>');
    if (tagO !== tagC) console.log(`${filename}: Tags unbalanced! <:${tagO}, >:${tagC}`);

    const sq = count("'");
    if (sq % 2 !== 0) console.log(`${filename}: Single quotes unbalanced! ${sq}`);

    const dq = count('"');
    if (dq % 2 !== 0) console.log(`${filename}: Double quotes unbalanced! ${dq}`);

    const bt = count('`');
    if (bt % 2 !== 0) console.log(`${filename}: Backticks unbalanced! ${bt}`);
});
