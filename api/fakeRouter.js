const sqlite3 = require('sqlite3');
const path = require('path');
const fakeRouter = require('express').Router();

const db = new sqlite3.Database(path.resolve(__dirname, '../database.db'));

fakeRouter.param('fakeId', (req, res, next) => {
  db.get('SELECT * FROM Pokemon WHERE id = ?', [Number(req.params.fakeId)], (error, row) => {
    if (error) {
      res.status(500).send({ error });
    } else if (row) {
      req.pokemon = row;
      next();
    } else {
      res.status(404).send();
    }
  })
});

fakeRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Pokemon WHERE generation = "X"', (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else if (rows) {
      res.send({ pokemon: rows });
    } else {
      res.status(404).send();
    }
  });
});

fakeRouter.get('/:fakeId', (req, res, next) => {
  res.send({ pokemon: req.pokemon });
})

fakeRouter.post('/', (req, res, next) => {
  const body = req.body;

  if (!body || !body.id || !body.name || !body.type_i || !body.ability_i) {
    res.status(422).send({ error: 'Missing parameter(s)' });
  } else {
    db.run('INSERT INTO Pokemon (id, name, generation, hp, atk, def, spa, spd, spe, total, type_i, type_ii, ability_i, ability_ii, hidden_ability, ev_worth, gender, egg_group_i, egg_group_ii, catch, evolve) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      body.id, body.name, 'X', body.hp, body.atk, body.def, body.spa, body.spd, body.spe, body.total, body.type_i, body.type_ii, body.ability_i, body.ability_ii, body.hidden_ability, body.ev_worth, body.gender, body.egg_group_i, body.egg_group_ii, body.catch, body.evolve
    ], function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        db.get('SELECT * FROM Pokemon WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send({ pokemon: row });
          }
        })
      }
    })
  }
});

fakeRouter.delete('/', (req, res, next) => {
  db.run('DELETE FROM Pokemon WHERE generation = "X"', function (error) {
    if (error) {
      res.status(500).send({ error });
    } else {
      res.status(204).send();
    }
  });
});

fakeRouter.delete('/:fakeId', (req, res, next) => {
  if (req.pokemon.id) {
    db.run('DELETE FROM Pokemon WHERE id = ?', [req.pokemon.id], function (error) {
      if (error) {
        res.status(500).send({ error });
      } else {
        res.status(204).send();
      }
    })
  }
});


module.exports = fakeRouter;
