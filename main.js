const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const Todo = require('./models/Todo.js')
const port = process.env.PORT || 3000
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/todo'

const app = express()
app.use(express.json())

mongoose.connect(mongoUri)
    .then(() => {
        console.log(`Connected to MongoDB successfully: ${mongoUri}`)
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err)
    })

app.use(express.static(path.join(__dirname, 'public')))

app.post('/api/post/taskname', async (req, res) => {
    try {
        const taskName = req.body
        const createdTask = await Todo.create(taskName)
        console.log('Task created:', createdTask)
        res.status(201).json({ status: "received", data: createdTask })
    } catch (err) {
        console.error('Error creating task:', err)
        res.status(500).json({ error: 'Failed to create task' })
    }
})

// deleting task
app.delete('/api/delete/taskname', async (req, res) => {
    try {
        const taskName = req.body
        await Todo.deleteOne({ id: String(taskName.id) })
        console.log('Task deleted:', taskName)
        res.json({ status: "deleted" })
    } catch (err) {
        console.error('Error deleting task:', err)
        res.status(500).json({ error: 'Failed to delete task' })
    }
})

// patching task
app.patch('/api/patch/taskname', async (req, res) => {
    try {
        const taskName = req.body
        await Todo.updateOne(
            { id: String(taskName.id) },
            {
                $set: {
                    id: String(taskName.id),
                    title: taskName.title,
                    completed: taskName.completed
                }
            }
        )
        console.log('Task patched:', taskName)
        res.json({
            status: "patched",
            data: taskName.title,
            completed: taskName.completed
        })
    } catch (err) {
        console.error('Error updating task:', err)
        res.status(500).json({ error: 'Failed to update task' })
    }
})

// fetching tasks
app.get('/api/gettasks', async (req, res) => {
    try {
        const dataArray = await Todo.find({})
        res.json({ data: dataArray })
    } catch (err) {
        console.error('Error fetching tasks:', err)
        res.status(500).json({ error: 'Failed to fetch tasks', data: [] })
    }
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})