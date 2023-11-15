const userModel = require('../model/User.js');
const Sequelize = require('../util/database.js')
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk')

require('dotenv').config()



const signup = async (req, res, next) => {

    console.time("authController : signup");
    let { name, email,password } = req.body;
    email = email.toLowerCase();
    console.log("authController : signup :: email is ", email);
    try {
        const isUserExists = await userModel.findOne({ where: { email: email } });
        console.log("authController : signup :: isUserExists : ", isUserExists);
        // when the user already register.
        if (isUserExists) {
            res.status(409).json({
                error: true,
                message: "User already exists..",
                data: null
            });
        } else {
            let saltRound = 10;
            let salt = await bcrypt.genSalt(saltRound);
            let hashedPassword = await bcrypt.hash(password, salt)

            let userResponse = await userModel.create({
                    name,email, password:hashedPassword,
                })

            if(userResponse){
                res.status(200).json({
                    error: false,
                    message: 'Register Successfully',
                    data: [userResponse]
                })
            }
        
        }
    } catch (err) {
        next(err)
    } finally {
        console.timeEnd("authController : signup");
    }

}

let signin = async (req, res, next)=>{
    console.time("authController : signup");
    let {email,password } = req.body;
    email = email.toLowerCase();
    console.log("authController : signup :: email is ", email);
    try {
        const UserData = await userModel.findOne({ where: { email: email } });
        // when the user already register.
        console.log(UserData.password);
        if (UserData) {
            let {id,email,ispremiumuser,totalExpenses}=UserData;
            // console.log("ddddddddddffffffff",UserData);
            let isPasswordValid = await bcrypt.compare(req.body.password,UserData.password);
            const payload = {id};
            const token = jwt.sign(payload, "thisissecreateKey", { expiresIn: "24hr" });
                
            if(isPasswordValid){
                res.status(200).json({
                    error: false,
                    message: "Login Succesfull",
                    token: token
                });    
            }else{
                res.status(404).json({
                    error: true,
                    message: "Invalid Password",
                    data: null
                });  
            }
            
        } else {

            // let userResponse = await userModel.create({
            //         name,email, password,
            //     })

            // if(userResponse){
            //     res.status(200).json({
            //         error: false,
            //         message: 'Register Successfully',
            //         data: [userResponse]
            //     })
            // }
            res.status(404).json({
                error: true,
                message: "User not found",
                data: null
            });
        
        }
    } catch (err) {
        next(err)
    } finally {
        console.timeEnd("authController : signup");
    }
}

// let sendEmail = async (req, res, next)=>{

//     const client = Sib.ApiClient.instance
//     const apiKey = client.authentications['api-key']
//     apiKey.apiKey = process.env.API_KEY

//     // let {email } = req.body;
 
//     // try {
        
            
       
//     // } catch (err) {
//     //     next(err)
//     // } finally {
//     //     console.timeEnd("authController : signup");
//     // }

//     const tranEmailApi = new Sib.TransactionalEmailsApi()
//     const sender = {
//         email: 'srlohith92@gmail.com',
//         name: 'lohith',
//     }
//     const receivers = [
//         {
//             email: 'srlohith92@gmail.com',
//         },
//     ]

// tranEmailApi
//     .sendTransacEmail({
//         sender,
//         to: receivers,
//         subject: 'Subscribe to Cules Coding to become a developer',
//         textContent: `
//         Cules Coding will teach you how to become {{params.role}} a developer.
//         `,
//         htmlContent: `
//         <h1>Cules Coding</h1>
//         <a href="https://cules-coding.vercel.app/">Visit</a>
//                 `,
//         params: {
//             role: 'Frontend',
//         },
//     })
//     .then(console.log)
//     .catch(console.log)

// }


module.exports={
    signup,
    signin,
    // sendEmail
}