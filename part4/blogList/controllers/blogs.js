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
        response.status(400).send('error: ', exception).end()
    }
})

module.exports = blogsRouter