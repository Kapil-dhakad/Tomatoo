const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password :{
        type: String,
        required: true
    },
    cartData:{
        type: Object,
        default: {}
    }
},{minimize: false})


userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel