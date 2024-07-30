const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../utils/middleware').userExtractor


blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)

})

blogsRouter.post('/', userExtractor, async (request, response) => {

    const body = request.body

    const user = await User.findById(request.user.id)

    if(!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: `not found blog with id ${request.params.id}` })
    }

    if (!request.user.id || request.user.id.toString() !== blog.user.toString()) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

    const blog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes
    }
    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(result)
})

module.exports = blogsRouter