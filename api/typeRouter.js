const sqlite3 = require('sqlite3');
const path = require('path');
const typeRouter = require('express').Router();

const db = new sqlite3.Database(path.resolve(__dirname, '../database.db'));

typeRouter.param('primaryType', (req, res, next) => {
  let type = req.params.primaryType[0].toUpperCase() + req.params.primaryType.slice(1).toLowerCase();
  db.all('SELECT * FROM Pokemon WHERE type_i like ? or type_ii like ?', [type, type], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else if (rows) {
      req.pokemon = rows;
      next();
    } else {
      res.status(404).send(`No pokemon found of type ${primaryType}`);
    }
  });
});

typeRouter.get('/:primaryType', (req, res, next) => {
  res.send({ pokemon: req.pokemon });
});

typeRouter.get('/:primaryType/:secondaryType', (req, res, next) => {
  let type1 = req.params.primaryType[0].toUpperCase() + req.params.primaryType.slice(1).toLowerCase();
  let type2 = req.params.secondaryType[0].toUpperCase() + req.params.secondaryType.slice(1).toLowerCase();

  db.all('SELECT * FROM Pokemon WHERE (type_i like ? AND type_ii like ?) OR (type_i like ? AND type_ii like ?)', [type1, type2, type2, type1], (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else if (rows) {
      res.send({ pokemon: rows });
    } else {
      res.status(404).send(`No pokemon found of type ${req.params.primaryType} and ${req.params.secondaryType}`);
    }
  });
});

module.exports = typeRouter;
