const mongoose = require('mongoose')
const path = require('path')
var router = require('express').Router();
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


// only created by this user
router.get('/contacts', (req, res, next)=>{ 
    
    
    Contact.find().then(all_contacts=>{  
          
        // if(err){
        //     console.log(err)
        //     next(err)
        // }
        let contacts = []    
        all_contacts.forEach(contact=>{
            console.log(contact)
            contacts.push({
                image: contact._doc.image,
                address: contact._doc.address,
                about: contact._doc.about,
                phone_number: contact._doc.phone_number,
                email: contact._doc.email,
                lastname: contact._doc.lastname,
                firstname: contact._doc.firstname,
                _id: contact._doc._id
            })    
        })
        res.json(contacts)    
    }).catch(err=>next(err))
        
})

// save contact id in user 
router.post('/contact/add', upload.single('image') ,(req, res, next)=>{ 
    
    
    // const newContact = new Contact(req.body)
    let firstname = req.body.firstname,
        lastname = req.body.lastname,
        email = req.body.email,
        phone_number = req.body.phone_number,
        about = req.body.about,
        address = req.body.address,
        tags = req.body.tags
    let image = req.file
    const newContact = new Contact({
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone_number: phone_number,
        about: about,
        address: address,
        image: image.path,
    })
    // newContact.save().then(function () {
    //     return res.json({success:true})
    // }).catch(next)
    newContact.save().then(()=>{
        res.json({success:true})
    }).catch(next)
    
})

router.post('/contact/edit/:id', (req,res,next) => {
    
    const id = req.params.id
    
    Contact.findOneAndUpdate({_id:id},{image:"uploads/uploads/image-1583310911247.svg"}).then(resp=>res.json(resp)).catch(err=>next(err))
    
})

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
