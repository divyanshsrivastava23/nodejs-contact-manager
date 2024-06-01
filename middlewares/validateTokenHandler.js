const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
 

// verify token, stores decoded user information in req.user
const validateToken = expressAsyncHandler(async (req,res,next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error("User is not authorised.")
            } 
            req.user = decoded.user;
            next();
        });
        if(!token) {
            res.status(401);
            throw new Error("User is not authorised or token is missing")
        }
    }
})  

module.exports = validateToken;