const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

const files = fs.readdirSync(__dirname).filter((file) => {
  return file.endsWith('.js') && file !== 'index.js' && file !== 'config.js' && file !== 'database.js';
});

files.forEach((file) => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
