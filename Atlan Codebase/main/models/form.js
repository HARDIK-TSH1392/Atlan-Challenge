const { DataTypes } = require('sequelize');

module.exports = function defineFormModel(sequelize) {
  const Form = sequelize.define('Form', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    formName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question5: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Form.associate = function associate(models) {
    Form.hasOne(models.Response, { foreignKey: 'formId', onDelete: 'CASCADE' });
  };

  return Form;
};
