const sqlite3 = require('sqlite3');
const path = require('path');
const genRouter = require('express').Router();

const db = new sqlite3.Database(path.resolve(__dirname, '../database.db'));

genRouter.get('/:genId', (req, res, next) => {
  let genId = req.params.genId;
  let verb = Boolean(req.params.verbose);

  if (!isNaN(parseInt(genId))) {
    switch (Number(genId)) {
      case 1:
        genId = 'I';
        break;
      case 2:
        genId = 'II';
        break;
      case 3:
        genId = 'III';
        break;
      case 4:
        genId = 'IV';
        break;
      case 5:
        genId = 'V';
        break;
      case 6:
        genId = 'VI';
        break;
      case 7:
        genId = 'VII';
        break;
      case 8:
        genId = 'VIII';
        break;
      case 9:
        genId = 'IX';
        break;
      default:
        break;
    }
  }

  let sql;
  if (verb) {
    sql = 'SELECT * FROM Pokemon WHERE generation like ?'
  } else {
    sql = 'SELECT id, name, type_i, type_ii FROM Pokemon WHERE generation like ?'
  }

  db.all(sql, [genId], (error, rows) => {
    if (error) {
      res.status(404).send(err);
    } else {
      res.send({ pokemon: rows });
    }
  })
});

module.exports = genRouter;
