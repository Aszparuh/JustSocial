const init = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
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
  
    post.associate = (models) => {
      post.belongsTo(models.user);
      post.hasMany(models.comment);
    };
  
    return post;
}

module.exports = init;