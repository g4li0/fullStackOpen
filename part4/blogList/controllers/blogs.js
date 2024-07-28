const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    }
    catch (exception) {
        response.status(404).send('error: ', exception).end()
    }
})

blogsRouter.post('/', async (request, response) => {

    try {
        const blog = new Blog(request.body)
        const result = await blog.save()
        response.status(201).json(result)
    }
    catch (exception) {
        response.status(400).send(`error ${exception}`).end()
    }
})

blogsRouter.delete('/:id', async (request,response) => {
    try{
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    catch (exception) {
        response.status(400).send(`error ${exception}`).end()
    }
})

blogsRouter.put('/:id', async (request, response) => {
    try{
        const blog = {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes
        }
        const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(result)
    }
    catch (exception) {
        response.status(400).send(`error ${exception}`).end()
    }
})

module.exports = blogsRouter