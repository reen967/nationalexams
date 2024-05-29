const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const bodyParser = require('body-parser');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(bodyParser.json());

const itemsFilePath = './data/items.json';

const readItems = () => {
  if (!fs.existsSync(itemsFilePath)) return [];
  const data = fs.readFileSync(itemsFilePath);
  return JSON.parse(data);
};

const writeItems = (items) => {
  fs.writeFileSync(itemsFilePath, JSON.stringify(items, null, 2));
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/items', (req, res) => {
  const items = readItems();
  res.json(items);
});

app.get('/items/:id', (req, res) => {
  const items = readItems();
  const item = items.find(i => i.id === req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

app.post('/items', (req, res) => {
  const items = readItems();
  const newItem = req.body;
  items.push(newItem);
  writeItems(items);
  res.status(201).json(newItem);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
