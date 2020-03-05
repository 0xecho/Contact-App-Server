const mongoose = require('mongoose')
const mongooseUnique = require('mongoose-unique-validator')

const ContactSchema = new mongoose.Schema({  
    firstname : {type: String, required: [true, "can't be empty!"],match:[/^[a-zA-Z']+$/, 'must on only contain lowercase or uppercase characters!']},
    lastname : {type: String, required: [true, "can't be empty!"],match:[/^[a-zA-Z']+$/, 'must on only contain lowercase or uppercase characters!']},
    email : {type: String, lowercase: true, unique: true, required: [true, "can't be empty!"],match:[/\S+@\S+\.\S+/, 'must on only contain lowercase or uppercase characters!']},
    phone_number : String, // TODO: Add Regex
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