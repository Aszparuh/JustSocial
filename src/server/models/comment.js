const init = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
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
  
    comment.associate = (models) => {
        comment.belongsTo(models.post);
        comment.hasMany(models.like);
    };
  
    return comment;
}

module.exports = init;