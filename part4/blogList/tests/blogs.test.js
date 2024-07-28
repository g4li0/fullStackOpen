const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)

describe('test /api/blogs with method', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})

        const blogObjects = helper.blogList.map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })

    test('GET blogs: correct Content-Type and length', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, helper.blogList.length)

    })

    test('GET blogs: correct data params', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const allHaveId = response.body.every(blog => blog.id !== undefined)
        assert.strictEqual(allHaveId, true)

    })

    const newBLog = {
        title: 'test',
        author: 'test',
        url: 'test',
        likes: 0
    }

    test('POST blogs: increases blogs by one and new content stored correctly', async () => {
        const oldBlogs = helper.blogList

        const response = await api
            .post('/api/blogs')
            .send(newBLog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const newBlogs = await api.get('/api/blogs')

        const found = newBlogs.body.find(blog => blog.id === response.body.id)

        assert.strictEqual(newBlogs.body.length, oldBlogs.length + 1)
        assert.strictEqual(found.title, newBLog.title)
        assert.strictEqual(found.author, newBLog.author)
        assert.strictEqual(found.url, newBLog.url)
        assert.strictEqual(found.likes, newBLog.likes)
    })

    test('POST blogs: likes default to 0 if not provided', async () => {
        const response = await api
            .post('/api/blogs')
            .send({
                title: 'test',
                author: 'test',
                url: 'test'
            })
            .expect(201)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.likes, 0)
    })

    test('POST blogs: title and url are required', async () => {
        await api
            .post('/api/blogs')
            .send({})
            .expect(400)
        await api
            .post('/api/blogs')
            .send({ title: 'test' })
            .expect(400)
        await api
            .post('/api/blogs')
            .send({ url: 'test' })
            .expect(400)
        await api
            .post('/api/blogs')
            .send({ title: 'test', url: 'test' })
            .expect(201)
    })

    test('DELETE blogs: correct status code and length', async () => {
        const blogs = await api.get('/api/blogs')
        const id = blogs.body[0].id

        await api
            .delete(`/api/blogs/${id}`)
            .expect(204)

        const newBlogs = await api.get('/api/blogs')
        assert.strictEqual(newBlogs.body.length, blogs.body.length -1)
    })

    test('PUT blogs: correct status, content type and increment of likes', async () => {
        const blogs = await api.get('/api/blogs')
        const id = blogs.body[0].id

        const updateData = {
            ...blogs.body[0],
            likes: blogs.body[0].likes + 1
        }

        const response = await api
            .put(`/api/blogs/${id}`)
            .send(updateData)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.likes, blogs.body[0].likes + 1)
    })

    after(async () => {
        await mongoose.connection.close()
    })
})