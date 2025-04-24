const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phoneValidator = (number) => {
    const regex = /^\d{2,3}-\d+$/
    return regex.test(number) && number.length >= 8
  }

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'Name must be at least 3 characters long'],
      required: [true, 'Name is required']
    },
    number: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: phoneValidator,
        message: props => `${props.value} is not a valid phone number. Use format XX-XXXXXXX or XXX-XXXXXXXX`
      }
    }
  })
  
  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)
