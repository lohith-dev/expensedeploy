let jwt = require('jsonwebtoken');
const User = require('../model/User.js');

const authenticate = (req, res, next) => {
    // console.debug("authorization --> " + req.headers["authorization"]);
    // console.log("jhkhkjhkjhkjh",req.headers["authorization"]);
    if (req.headers["authorization"]) {
        // const token = req.headers["authorization"].split(" ")[1];
        const token = req.headers['authorization'];

        console.log("sddddddddddddddddddddddddddd",token);

        const payload = jwt.verify(token, "thisissecreateKey")
        // console.log("jjjjjjjjjjj",payload);

        const decode = jwt.decode(token);
        // console.log(decode);
            User.findOne({where:{id:decode.id}})
                .then(user => {
                 req.user = user;
                 next();
                })
    .catch(err => console.log(err));
        // req.user=decode;
        // next();
    } else {
        res.status(401).json({
            error: true,
            message: "Not Authorized",
            data: null
        })
    }
}


module.exports = {
    authenticate
}