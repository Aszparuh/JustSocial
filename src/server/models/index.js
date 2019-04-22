/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const data = {};


const init = () => {
  if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    // eslint-disable-next-line no-redeclare
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      var model = sequelize['import'](path.join(__dirname, file));
      data[model.name] = model;
    });

  Object.keys(data).forEach(modelName => {
    if (data[modelName].associate) {
      data[modelName].associate(data);
    }
  });

  data.sequelize = sequelize;
  data.Sequelize = Sequelize;
  data.sequelize.sync();
  return data;
}



module.exports = {
  init
};