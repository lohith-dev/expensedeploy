const Sequelize = require('sequelize');
const sequelize  = require('../util/database');

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests',{
  id: {
    type: Sequelize.STRING,
    allowNull:false,
    primaryKey:true
  }, 
  userId : {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isactive : {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },  
},
{
    timestamps: true,
    underscored: true
})


module.exports = ForgotPasswordRequests;
