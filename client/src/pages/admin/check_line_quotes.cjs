const fs = require('fs');
const readline = require('readline');

async function checkQuotes(filename, quoteChar) {
    const fileStream = fs.createReadStream(filename);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        const count = line.split(quoteChar).length - 1;
        if (count % 2 !== 0) {
            console.log(`Line ${lineNum}: ${line}`);
        }
    }
}

const file = process.argv[2];
const char = process.argv[3];
checkQuotes(file, char);
