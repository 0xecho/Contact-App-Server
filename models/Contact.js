const mongoose = require('mongoose')
const mongooseUnique = require('mongoose-unique-validator')

const ContactSchema = new mongoose.Schema({  
    firstname : {type: String, required: [true, "can't be empty!"],match:[/^[a-zA-Z']+$/, 'must on only contain lowercase or uppercase characters!']},
    lastname : {type: String, required: [true, "can't be empty!"],match:[/^[a-zA-Z']+$/, 'must on only contain lowercase or uppercase characters!']},
    email : {type: String, lowercase: true, unique: true,match:[/\S+@\S+\.\S+/, 'must on only contain lowercase or uppercase characters!']},
    phone_number : {type: String, unique: true, match:[ /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/ , 'must be a valid phone number']},
    about: String,
    address: String,
    image : String,
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true,usePushEach: true})

ContactSchema.plugin(mongooseUnique, {message: 'is taken.'})

module.export = mongoose.model('Contact', ContactSchema)