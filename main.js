const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const todoSchema = require('./models/Todo.js')

const app = express()
const port = 3000
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/todo')

app.use(express.static(path.join(__dirname, 'public')));

// receving task

app.post('/api/post/taskname', async (req, res) => {
    const taskName = req.body
    await todoSchema.insertOne(taskName)
    console.log(taskName)
    res.json({ "status": "received" })
})

// deleting task

app.delete('/api/delete/taskname', async (req, res) => {
    const taskName = req.body
    await todoSchema.deleteOne({ 'id': taskName.id })
    console.log(taskName)
    res.json({ "status": "deleted" })
})

// patching task

app.patch('/api/patch/taskname', async (req, res) => {
    const taskName = req.body
    await todoSchema.updateOne({ 'id': taskName.id },
        {
            $set: {
                'id': taskName.id,
                'title': taskName.title,
                'completed': taskName.completed
            }
        })
    console.log(taskName)
    res.json({
        "status": "patched",
        "data": taskName.title,
        'completed': taskName.completed
    })
})

app.get('/api/gettasks', async (req,res)=>{
    const dataArray = await todoSchema.find({})
    const OBJ = {
        'data' : dataArray
    }

    res.json(OBJ)
})

app.listen(port, () => {
    console.log(`listening on ${port}`)
})