const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: String,
    id: Number,
    completed: { type: Boolean, default: false }
})

module.exports = mongoose.model('todoSchema', todoSchema)