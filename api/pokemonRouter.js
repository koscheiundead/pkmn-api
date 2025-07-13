const sqlite3 = require('sqlite3');
const path = require('path');
const pokemonRouter = require('express').Router();

const db = new sqlite3.Database(path.resolve(__dirname, '../database.db'));

pokemonRouter.param('pokemonId', (req, res, next, pokemonId) => {
  const id = parseInt(pokemonId);

  if (isNaN(id)) {
    db.get('SELECT * FROM Pokemon WHERE name like ?', [pokemonId], (err, row) => {
      if (err) {
        res.status(404).send(err);
      } else {
        req.pokemon = row;
        next();
      }
    });
  } else {
    db.get('SELECT * FROM Pokemon WHERE id = ?', [identity], (err, row) => {
      if (err) {
        res.status(404).send(err);
      } else {
        req.pokemon = row;
        next();
      }
    });
  }
});

pokemonRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Pokemon', (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ pokemon: rows });
    }
  });
})

pokemonRouter.get('/:pokemonId', (req, res, next) => {
  res.send({ pokemon: req.pokemon });
})

module.exports = pokemonRouter;
