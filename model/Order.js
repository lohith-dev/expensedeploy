const Sequelize = require('sequelize');
const sequelize  = require('../util/database');

const UserModel = require('./User.js')

const Order = sequelize.define('order',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement :true,
    allowNull:false,
    primaryKey:true
  }, 
  paymentid: {
    type: Sequelize.STRING,

  },
  Orderid: {
    type: Sequelize.STRING,

  },
  status :{  
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
},
{
    timestamps: true,
    underscored: true
})



module.exports = Order;
