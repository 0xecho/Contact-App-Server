const mongoose = require('mongoose')
const mongooseUnique = require('mongoose-unique-validator')

const TagSchema = new mongoose.Schema({  
    tag_name: String,
    contact : {type: mongoose.Schema.Types.ObjectId, ref:"Contact"}
}, {timestamps: true})

TagSchema.plugin(mongooseUnique, {message: 'is taken.'})

module.export = mongoose.model('Tag', TagSchema)