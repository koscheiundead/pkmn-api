const sqlite3 = require('sqlite3');
const fs = require('fs');

const db = new sqlite3.Database('./database.db');

db.all('SELECT * FROM Pokemon', (err, rows) => {
  if (err) {
    console.log(err);
  } else {
    fs.writeFileSync('./out.json', JSON.stringify(rows), 'utf8', function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('File written!');
      }
    });
  }
});
