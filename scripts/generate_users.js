const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/* 
    Simple node script to generate 100 users.
    
    Execute with: 
    node scripts/generate_users.js

    DEPRECATED - using Knex in stead of raw SQL now.
*/

function toAlphabetic(num) { // Number to alphabetic. 1 = A, 2 = B, 27 = AA, etc.
    let alphabetic = '';
    while (num > 0) {
        const mod = (num - 1) % 26;
        alphabetic = String.fromCharCode(65 + mod) + alphabetic;
        num = Math.floor((num - mod) / 26);
    }
    return alphabetic;
}

const generateUsers = () => {
    const users = [];
    for (let id = 1; id <= 100; id++) {
        const name = `User ${toAlphabetic(id)}`;
        const uuid = uuidv4();
        users.push(`('${uuid}', '${name}')`);
    }

    const values = users.join(',\n');

    const outPath = path.join(__dirname, 'test_data.sql');
    fs.writeFileSync(outPath, `INSERT INTO users (uuid, name) VALUES\n${values};`);
}
generateUsers();