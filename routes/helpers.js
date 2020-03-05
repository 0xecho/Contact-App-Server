const jwt = require('jsonwebtoken');
const secret = require('../config/index').secret

module.exports = {
        getUserFromTokenOrError: function(req,res,next){
            var token; 
            token = req.headers['x-access-token']
            if(token)
            {
                try{
                    const verify = jwt.verify(token, secret)   
                    return verify
                } catch (err) {
                    next(err)
                }        
                
            } else {
                res.json({"success":false,"error":"You need to Login first."})
                next()
            }
        }
}