const init = (sequelize, DataTypes) => {
    const like = sequelize.define('like', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        title: DataTypes.STRING,
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
      },
      {
        freezeTableName: true,
      }
    );
  
    like.associate = (models) => {
        like.belongsTo(models.post);
        like.belongsTo(models.comment);
    };
  
    return like;
}

module.exports = init;