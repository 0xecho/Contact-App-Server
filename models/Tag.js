const mongoose = require('mongoose')
const mongooseUnique = require('mongoose-unique-validator')

const TagSchema = new mongoose.Schema({  
    tag_name: String,
    owner :  {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    contact : {type: mongoose.Schema.Types.ObjectId, ref:"Contact"},
    color: String
}, {timestamps: true})

TagSchema.plugin(mongooseUnique, {message: 'is taken.'})

module.export = mongoose.model('Tag', TagSchema)