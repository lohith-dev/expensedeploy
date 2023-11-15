const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const fs =require('fs');
const path =require('path');
const userRouter = require('./routes/userRouter.js');
const expenseRouter = require('./routes/expenseRouter.js');
const purchaseRouter = require('./routes/pruchaseRouter.js');
const leadboardRouter = require('./routes/leadboardRouter.js');
const passRouter = require('./routes/passwordRouter.js');

const errorController = require('./controllers/error');
require('dotenv').config();

const sequelize = require('./util/database');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
);


const morgan = require('morgan');


app.use(express.json());
app.use(morgan('combined',{stream:accessLogStream}))


app.use('/auth', userRouter);
app.use('/password', passRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', purchaseRouter);
app.use('/leadboard', leadboardRouter);


app.use(errorController.get404);
// {force:true}
const PORT = process.env.PORT || 3000;
sequelize.sync().then(result=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT} `);
    });
})
.catch(err=>{
    console.log(err);
})

// app.listen(8000,()=>{
//     console.log("Server listening at port 8000");
// });
module.exports=app;


