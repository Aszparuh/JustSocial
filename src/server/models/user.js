const init = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: DataTypes.STRING,
          unique: true
        },
        password: DataTypes.STRING
      },
      {
        freezeTableName: true,
      }
    );
  
    user.associate = (models) => {
        user.hasMany(models.post);
    };
  
    return user;
}

module.exports = init;