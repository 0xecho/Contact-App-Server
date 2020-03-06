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
router.get('/contacts', async (req, res, next)=>{ 
    let filters = null
    try{
        filters = req.query['filter'].split(',')    
    }catch(err){}
    const username = getUserFromTokenOrError(req, res, next).username
    User.findOne({username:username}).then(function(user){  
        user = user.toObject()
        console.log(user._id);
        Contact.find({owner: user._id},async function(err,resp){
            var contacts = []
            for(let contact of resp){
                if(filters){
                    let promiseOfTag = await Tag.find({   
                        contact: contact._doc._id,
                        }).then(function(tags){
                            // console.log("FoUND TAGS");
                            
                            let found_tag = 0
                            for(let tag of tags){
                                
                                if(filters.includes(tag._doc.tag_name.toLowerCase()))
                                {   
                                    
                                    found_tag = 1
                                }
                            }
                                
                            return found_tag
                        }).catch(err=>console.log(err))
                        
                    if(promiseOfTag){
                        contacts.push(contact._doc)
                    }
                    
                } else {
                    contacts.push(contact._doc)
                }
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
                    tag_name: tag.toLowerCase(),
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
        Contact.find({  
            owner: user._id.toString(),
            _id: id
        }).then(function(contact){
            
            Tag.find({contact:contact[0]._id}).then((tags)=>{
                let all_tags = {
                    all_tags:[]
                }
                for(let i=0;i<tags.length;i++)
                {
                    all_tags.all_tags.push(tags[i]._doc)
                }
                
                
                if(contact.length){
                    let result = {...contact[0]._doc,...all_tags}
                    res.json(result)
                }else {
                    res.json({
                        success: false,
                        message: "Contact Not Found"
                    })
                }
            })
        }).catch(err=>next(err))
    })
})

// TODO EDIT CONTACT
router.post('/contact/edit/:id', (req,res,next) => {
    
    const id = req.params.id
    let updates = req.body.updates
    // Multipart form data because of the image
    // if tag in updates add new tag item
    // for anything else update values directly
    Contact.findOneAndUpdate({_id:id},{image:"uploads/uploads/image-1583310911247.svg"}).then(resp=>res.json(resp)).catch(err=>next(err))
    
})

router.get('/contact/delete/:id' , (req, res, next)=>{    
    
    let id = req.params.id
    Contact.findById(id).then(contact=>{
        if(contact){
            contact.remove().then(status=>{
                res.json(status)
            }).catch(err=>{
                res.json({ 
                    success: false,
                    message: "Error deleting contact"
                })
            })
        }else {
            res.json({
                success: false,
                message: "Contact Not Found"
            })
        }
    })
    
})

router.get('/userinfo' , (req, res, next)=>{    
    
    const username = getUserFromTokenOrError(req, res, next).username
    
    User.findOne({username:username}).then(function(user){
        let response = {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            profile_picture: user.profile_picture
        }
        res.send(response)
    })
    
})

router.post('/updateProfile',upload.single('profile_picture') ,async (req,res,next)=>{
        
    const updates = req.body
    if(req.file!== undefined){
        updates['profile_picture'] = req.file.path
    }
    const username = getUserFromTokenOrError(req, res, next).username
    User.findOneAndUpdate({username:username}, updates).then(result=>{
        res.json({
            success: true
        })
    }).catch(next)
    
})

router.use('/', require('./users'));
router.use('/profiles', require('./profiles'));
router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;