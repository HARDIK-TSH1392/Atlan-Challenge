const { DataTypes } = require('sequelize');

module.exports = function defineResponseModel(sequelize) {
  const Response = sequelize.define('Response', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    answer1: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    answer2: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    answer3: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    answer4: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    answer5: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Response.associate = function associate(models) {
    Response.belongsTo(models.Form, { foreignKey: 'formId' });
  };

  return Response;
};
