require('dotenv').config();

const express = require('express');
const { Sequelize } = require('sequelize');

const host = process.env.host;
const dbName = process.env.dbName;
const userName = process.env.userName;
const password = process.env.password;
const port = process.env.port;

const app = express();

const sequelize = new Sequelize(dbName, userName, password, {
  host: host,
  dialect: 'postgres'
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    app.get('/', (req, res) => {
      res.send('Hello World!');
    })

    app.listen(port, () => {
      console.log(`Express started listening on port ${port}`);
    })
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();
