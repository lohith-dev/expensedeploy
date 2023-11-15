const Sequelize = require('sequelize');
const sequelize  = require('../util/database');

const FilesDownloaded = sequelize.define('FilesDownloaded',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement :true,
    allowNull:false,
    primaryKey:true
  }, 
  fileUrl : {
    type: Sequelize.STRING,
    allowNull: false,
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


module.exports = FilesDownloaded;
