const sqlite3 = require('sqlite3');
const papa = require('papaparse');
const fs = require('fs');

/*
STEPS:
-init database
-drop database if exists
-create table if not exists pokedex
-open national dex csv in papaparse
-for each row in national dex, insert row values into pokedex
*/

const db = new sqlite3.Database('./database.db');
db.serialize(() => {

  db.run('DROP TABLE IF EXISTS Pokemon');

  db.run(`CREATE TABLE IF NOT EXISTS Pokemon (id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    generation TEXT NOT NULL,
    hp INTEGER,
    atk INTEGER,
    def INTEGER,
    spa INTEGER,
    spd INTEGER,
    spe INTEGER,
    total INTEGER,
    type_i TEXT NOT NULL,
    type_ii TEXT,
    ability_i TEXT NOT NULL,
    ability_ii TEXT,
    hidden_ability TEXT,
    ev_worth TEXT,
    gender TEXT,
    egg_group_i TEXT,
    egg_group_ii TEXT,
    catch INTEGER,
    evolve TEXT);`, (error) => {
    if (error) {
      console.log(error);
    }
  });

  const file = fs.readFileSync('./national_dex.csv', 'utf-8');

  const data = papa.parse(file, {
    header: true
  }).data;

  data.forEach((pokemon) => {
    const num = pokemon.Nat.split(',').join('').trim();
    db.run(`INSERT INTO Pokemon (id, name, generation, hp, atk, def, spa, spd, spe, total, type_i, type_ii, ability_i, ability_ii, hidden_ability, ev_worth, gender, egg_group_i, egg_group_ii, catch, evolve) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      Number(num), pokemon.Pokemon, pokemon.Generation, Number(pokemon.HP), Number(pokemon.Atk), Number(pokemon.Def), Number(pokemon.SpA), Number(pokemon.SpD), Number(pokemon.Spe), Number(pokemon.Total), pokemon['Type I'], pokemon['Type II'], pokemon['Ability I'], pokemon['Ability II'], pokemon['Hidden Ability'], pokemon['EV Worth'], pokemon.Gender, pokemon['Egg Group I'], pokemon['Egg Group II'], pokemon.Catch, pokemon.Evolve
    ], function(err) {
      if (err) {
        console.error(err);
      }
    });
  });
});
