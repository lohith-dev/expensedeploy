const userModel = require('../model/User.js');
const Sequelize = require('../util/database.js');
const resetModel = require('../model/ForgotPasswordRequests.js')
const { v4: uuidv4 } = require('uuid');
const Sib = require('sib-api-v3-sdk');
const path = require('path');
let bcrypt = require('bcrypt');
require('dotenv').config()


let sendEmail = async (req, res, next)=>{
    const {email}=req.body;
    console.log(email);
    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY

    const isUserExists = await userModel.findOne({ where: { email: email } });

    if(!isUserExists){
        res.status(404).json({
            error: true,
            message: "User doesn't exists..",
            data: null
        });
    }else{
        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const reqId=uuidv4();
        const sender = {
            email: 'srlohith92@gmail.com',
            name: 'lohith',
        }
        const receivers = [
            {
                email:email,
            },
        ]

    tranEmailApi
        .sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Reset Password',
            textContent: `
                Please click the link below to reset the passwod.
            `,
            htmlContent:
                    '<p style="font-size:1.1em">Hi,</p>'+
                  '<p>You requested a pasaword reset</p>'+
                  'link :<a href="http://localhost:8000/password/resetpassword' + '/' +reqId + '">to set new password </a>' +
                  '<br><br>' 
                    ,
            params: {
                role: 'Frontend',
            },
        })
        .then(async(resp)=>{
            
          try{
            const data =await resetModel.create({
                id:reqId,isactive:true,userId:isUserExists.id
            })
           if(data){
                res.status(200).json({
                    message: "Email successfully sent...",
                    data: null
                });
           }
          }catch(err){
            console.log(err);
          }
        })
        .catch((err)=>{
            console.log(err);
        console.log("lllooooooooooooooo");
        })
    }

}



let resetPass = async (req, res, next)=>{
    const id=req.params.id;
    console.log("dfaaaaaaaaaaaa",id);
    const resetActive = await resetModel.findOne({ where: { id: id } });

    console.log(resetActive.isactive);
    if(resetActive.isactive){
        const formHtml = `
        <form action="/password/reset/${id}" method="post">
            <!-- Your form fields go here -->
            <label for="newPassword">New Password:</label>
            <input type="password" id="newPassword" name="newPassword" required>
            <button type="submit">Reset Password</button>
        </form>
    `;

    res.send(formHtml);
    }
   
}

let reset = async (req, res, next)=>{
     const id=req.params.id;
     const {newPassword} = req.body;
    
    const resetActive = await resetModel.findOne({ where: { id: id } });

    if(resetActive.isactive){
        let saltRound = 10;
        let salt = await bcrypt.genSalt(saltRound);
        let hashedPassword = await bcrypt.hash(newPassword, salt)

        let userResponse = await userModel.update({
               password:hashedPassword,
            },{where:{id:resetActive.userId}})

            let data= await resetModel.update({
                isactive:false,
             },{where:{id:id}})

        if(userResponse){

            const redirectHtml = `
            <html>
            <head>
                <title>Password Reset Success</title>
                <script>
                    setTimeout(function() {
                        window.location.href = 'file:///C:/Users/Pooja%20S%20R/OneDrive/Desktop/E-Tracker-2/login.html'; // Redirect to the login page after a delay
                    }, 1000); // 3000 milliseconds (3 seconds) delay
                </script>
            </head>
            <body>
                <p>Password reset successful. Redirecting to login page...</p>
            </body>
            </html>
        `
        res.send(redirectHtml);
        }
    }
   
}


module.exports={
    sendEmail,
    resetPass,
    reset
}