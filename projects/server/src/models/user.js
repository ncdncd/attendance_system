'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role,
        {foreignKey: "role_id"});
      User.hasMany(models.Attendance,
        {foreignKey: "user_id"});
      User.hasOne(models.Employee_detail,
        {foreignKey: "user_id"});
      User.hasMany(models.Payroll,
        {foreignKey: "user_id"});
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    access_token: DataTypes.STRING,
    exp_access_token: DataTypes.DATE,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};