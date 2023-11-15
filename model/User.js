const Sequelize = require('sequelize');
const expenseModel= require('./Expense.js')
const sequelize  = require('../util/database');
const orderModel = require('./Order.js')
const forgotPassModel = require('./ForgotPasswordRequests.js')
const fileModel = require('../model/FilesDownloaded.js')

const User = sequelize.define('User',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement :true,
    allowNull:false,
    primaryKey:true
  }, 
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique:true,
    allowNull: false,
  },
  password :{  
    type: Sequelize.STRING,
    allowNull: false,
  },
  ispremiumuser :{  
    type: Sequelize.BOOLEAN,
  },
  totalExpenses:{
    type : Sequelize.BIGINT,
    defaultValue: 0
  }
},
{
    timestamps: true,
    underscored: true
})

User.hasMany(expenseModel, { foreignKey: 'userId' });  
expenseModel.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(orderModel, { foreignKey: 'userId' });  
orderModel.belongsTo(orderModel, { foreignKey: 'userId' });

User.hasMany(forgotPassModel, { foreignKey: 'userId' });  
forgotPassModel.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(fileModel, { foreignKey: 'userId' });  
fileModel.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
