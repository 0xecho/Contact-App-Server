const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secret = require('../config').secret

router.use('/api', validateUser, require('./api'))
router.use('/auth', require('./auth'))
// router.use('/accounts', require('./accounts'))
// router.use('/contacts', require('./contacts'))

function validateUser(req, res, next)
{
    var token; 
    token = req.headers['x-access-token']
    if(token)
    {
        
        const verify = jwt.verify(token, secret).then((resp)=>console.log(resp)).catch((err)=>console.error(err))
        console.log(verify)
        next()
        
    } else {
        res.json({"success":false,"error":"You need to Login first."})
    }
        
    
}

module.exports = router;
