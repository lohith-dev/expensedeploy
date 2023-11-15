const expenseModel = require('../model/Expense.js');
const userModel = require('../model/User.js')
const Sequelize = require('../util/database.js')
const sequelize = require('../util/database.js');
const AWS = require('aws-sdk');
const fileModel = require('../model/FilesDownloaded.js');


async function fetchDataFromDatabase(offset, limit) {
    const result = await expenseModel.findAll({
      offset,
      limit,
    });
  
    return result;
  }

const getappntdata = async (req,res)=>{
     try{
        let {id}=req.user;
        const page = parseInt(req.query.page) || 1;
        console.log("page",req.query.page);
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 2;
        console.log("itemsperpage",req.query.itemsPerPage);
        // const itemsPerPage = 2; 
        // console.log(itemsPerPage);
     
        const offset = (page - 1) * itemsPerPage;

        const totalItemCount = await expenseModel.count();

        const data = await fetchDataFromDatabase(offset, itemsPerPage);

        res.status(200).json({
          success: true,
          data,
          currentPage: page,
          totalPages: Math.ceil(totalItemCount / itemsPerPage),
        });

            // const userData = await expenseModel.findAll({where:{user_id:id}});
      
            // let noOfRecords = userData.length;
            // res.status(200).json(
            //     {
            //         noOfRecords: noOfRecords,
            //         data: userData,
            //     }
            // );
            
     }catch(err){
        console.log(err);
     }
}


const getSingleAppntData = async (req,res)=>{
     try{
            
            let id=req.params.id;
            
       
            const userData = await expenseModel.findOne({
                where: { id: id },
            });
           
            if(!userData) return res.status(404).send("The appointement data with provided ID does not exist!");
            res.status(200).json(userData);
            
     }catch(err){
        console.log(err);
     }
}

const uploadToS3 =(data,filename)=>{
    const BUCKET_NAME ='e-track123';
    // const userKey =process.env.IAM_USER_KEY;
    // const userSecret=process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId:process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_USER_SECRET,
        Bucket : BUCKET_NAME
    })
    var params ={
        Bucket : BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    return new Promise ((resolve,reject)=>{
        s3bucket.upload(params,(err,data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data.Location)
              
            }
        })
    })
}

const downloadExpense = async (req,res)=>{
   try{
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringfiedExpenses = JSON.stringify(expenses);
    const userId= req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL=await uploadToS3(stringfiedExpenses,filename);
    const data = await fileModel.create({fileUrl:fileURL,userId:req.user.id})
    if(data){
        res.status(200).json({fileurl:fileURL,success:true});
    }
   }catch(err){
    res.status(500).json({fileurl:'',success:false, err:err});
   }
}

const postAppntdata = async (req,res)=>{
    try{
   
        let {expense,description,category}=req.body;
        let {id}=req.user;

        const result = await sequelize.transaction(async (t) => {

            const user = await expenseModel.create({
                expense,description,category,userId:id
            }, { transaction: t });

            let totExpense = parseInt(req.user.totalExpenses)+parseInt(expense);
            await userModel.update({totalExpenses:totExpense},{where:{id:id}, transaction: t });
        
            return user;
        
          });
    
           res.status(201).json({
            error: false,
            message: 'Appiontments created Successfully',
            data: result
        })
           
    }catch(err){

       console.log(err);
    }
}

const updAppntdata = async (req,res)=>{
    try{
        let {id,expense,description,category}=req.body;
    
        let date = new Date();



        // const number = parseInt(id, 10)
        // console.log(number,typeof(number));
        // console.log(Number(id));
        // console.log(Sequelize.literal('CURRENT_TIMESTAMP'));
        

        const deviceResponse = await expenseModel.update(
            {
                expense: expense,
                description: description,
                category: category,

              },
            {
                where: { id: id },
            })

            res.status(200).json(deviceResponse[1])
    }catch(err){
        console.log(err);
    }
}

const deleteAppntdata = async (req,res)=>{
    try{
        let id=req.params.id;
        
    //    let deleted=await expenseModel.destroy({
    //         where: {
    //           id: id
    //         }
    //       })
    let delData= await expenseModel.findOne({where:{id:id}})
    let subExpense = parseInt(req.user.totalExpenses)-parseInt(delData.dataValues.expense);
    console.log(subExpense);
    const result = await sequelize.transaction(async (t) => {
         let subExpense = parseInt(req.user.totalExpenses)-parseInt(delData.dataValues.expense);
       
         const user = await userModel.update({totalExpenses:subExpense},{where:{id:req.user.id}, transaction: t });
          
        await expenseModel.destroy({
            where: {
              id: id
            }
          })
        return user;
    
      });
         
    
            res.status(200).json({
                  error: false,
                  message: 'Appointment Deleted Successfully',
            })
     
           
    }catch(err){
       console.log(err);
    }
}

module.exports={
    getappntdata,
    postAppntdata,
    updAppntdata,
    deleteAppntdata,
    getSingleAppntData,
    downloadExpense,
}