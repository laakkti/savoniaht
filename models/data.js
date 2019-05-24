const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({

  dataset: {
    type: String,
    required: true
  },
  content: {
    type: Array,
    required: true

  },
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

})

dataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Data', dataSchema)