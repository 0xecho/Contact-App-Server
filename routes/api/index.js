var router = require('express').Router();

router.use('/future', function(req, res)
{
    res.send("YOU HAVE ARRIVED ONTO THE FUTURE")
})

module.exports = router;
