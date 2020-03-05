const mongoose = require('mongoose')
const path = require('path')
var router = require('express').Router();
const getUserFromTokenOrError = require('../helpers').getUserFromTokenOrError

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   cb(null, '../../public/profile_images/')
        cb(null, path.relative('.',path.join(__dirname,'../../uploads/uploads')))
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
      }  
  })
var upload = multer({storage: storage})

var Contact = mongoose.model('Contact')
var User = mongoose.model('User')
var Tag = mongoose.model('Tag')

// TODO only created by this user, AND FILTER BASED ON PARAM
router.get('/contacts', (req, res, next)=>{ 
    
    const username = getUserFromTokenOrError(req, res, next).username
    User.findOne({username:username}).then(function(user){  
        user = user.toObject()
        console.log(user._id);
        Contact.find({owner: user._id},function(err,resp){
            let contacts = []
            for(let contact of resp){
                contacts.push(contact._doc)
            }
            res.json(contacts)
        })
        // res.json(contacts)
        
    })
        
})

// save contact id in user 
router.post('/contact/add', upload.single('image') ,(req, res, next)=>{ 
    
    let firstname = req.body.firstname,
        lastname = req.body.lastname,
        email = req.body.email,
        phone_number = req.body.phone_number,
        about = req.body.about,
        address = req.body.address,
        tags = req.body.tags.split(',')
    let image = {
        path: "../../uploads/uploads/dummy.svg"
    }
    if(req.file !== undefined)
    {
        image = req.file
    }
    const username = getUserFromTokenOrError(req, res, next).username    
    
    User.findOne({username:username}).then(function(user){  
        
        const newContact = new Contact({
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone_number: phone_number,
            about: about,
            address: address,
            image: image.path,
            owner: user._doc._id
        })
        newContact.save((err,resp)=>{
            if(err)
            {
                next(err);
                return
            }
            console.log(resp);
            
            tags.forEach(tag=>{
                console.log(tag);
                Tag.create({
                    tag_name: tag,
                    owner: user._doc._id,
                    contact: resp._id,
                    color: "hsla(" + ~~(360 * Math.random()) + "," + "70%,"+ "80%,1)"
                }).catch(err=>next(err))
            })
            res.json({
                success: true,
            })
        })
    })
    
})

// Get a single contact info by using id
router.get('/contact/:id', (req, res, next)=>{ 
    
    const id = req.params.id
    const username = getUserFromTokenOrError(req, res, next).username
    
    User.findOne({username:username}).then(function(user){
        
        user = user.toObject()
        console.log(user);
        Contact.find({  
            owner: user._id.toString(),
            _id: id
        }).then(function(contact){
            if(contact){
                res.json(contact[0])
            }else {
                res.json({
                    success: false,
                    message: "Contact Not Found"
                })
            }
        }).catch(err=>next(err))
    })
})

// TODO EDIT CONTACT
// router.post('/contact/edit/:id', (req,res,next) => {
    
//     const id = req.params.id
    
//     Contact.findOneAndUpdate({_id:id},{image:"uploads/uploads/image-1583310911247.svg"}).then(resp=>res.json(resp)).catch(err=>next(err))
    
// })

// TODO DELETE CONTACT
// router.post('/contact/delete/:id', upload.single('image') ,(req, res, next)=>{ 
    
    
//     // const newContact = new Contact(req.body)
//     let firstname = req.body.firstname,
//         lastname = req.body.lastname,
//         email = req.body.email,
//         phone_number = req.body.phone_number,
//         about = req.body.about,
//         address = req.body.address,
//         tags = req.body.tags
//     let image = req.file
//     const newContact = new Contact({
//         firstname: firstname,
//         lastname: lastname,
//         email: email,
//         phone_number: phone_number,
//         about: about,
//         address: address,
//         image: image.path,
//     })
//     // newContact.save().then(function () {
//     //     return res.json({success:true})
//     // }).catch(next)
//     newContact.save().then(()=>{
//         res.json({success:true})
//     }).catch(next)
    
// })

module.exports = router;
