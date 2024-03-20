require('dotenv').config();

const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

const host = process.env.host;
const dbName = process.env.dbName;
const userName = process.env.userName;
const password = process.env.password;
const port = process.env.port;

const app = express();

const sequelize = new Sequelize(dbName, userName, password, {
  host: host,
  dialect: 'postgres',
  define: {
    freezeTableName: true
  }
});

const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: false });
    
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(bodyParser.json());

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.get('/users', async (req, res) => {
      const items = await User.findAll();
      let result = [];
      items.forEach(item => {
        result.push(item.dataValues);
      });
      res.send(result);
    })

    app.post('/user/create', async (req, res) => {
      const { body } = req;
      console.log('body: ', req.body);
      const item = await User.create({
        name: body.name,
        favoriteColor: body.favoriteColor,
        age: body.age,
        cash: body.cash
      });
      res.send(item.dataValues);
    });

    app.listen(port, () => {
      console.log(`Express started listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();
