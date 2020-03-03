const mongoose = require('mongoose')
const mongooseUnique = require('mongoose-unique-validator')

const ImageSchema = new mongoose.Schema({  
    image_path: String,
}, {timestamps: true})

ImageSchema.plugin(mongooseUnique, {message: 'is taken.'})

module.export = mongoose.model('Image', ImageSchema)