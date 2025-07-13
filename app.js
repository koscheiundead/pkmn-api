const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const pokemonRouter = require('./api/pokemonRouter');
const generationRouter = require('./api/generationRouter');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use('/pokemon', pokemonRouter);
app.use('/generation', generationRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Pokemon server listening on port ${port}! Pika-pi!`);
})
