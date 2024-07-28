const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})


describe('total likes', () => {


    test('of empty list is zero', () => {
        assert.strictEqual(listHelper.totalLikes([]), 0)
    })
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(helper.listWithOneBlog)
        assert.strictEqual(result, 5)
    })
    test('of a bigger list is calculated right', () => {
        assert.strictEqual(listHelper.totalLikes(helper.blogList), 36)
    })
})

describe('favorite blog', () => {
    test('when list is empty', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog([]), {})
    })
    test('when list has only one blog', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(helper.listWithOneBlog), helper.listWithOneBlog[0])
    })
    test('of a bigger list', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(helper.blogList), helper.blogList[2])
    })
})

describe('most blogs', () => {
    test('when list is empty', () => {
        assert.deepStrictEqual(listHelper.mostBlogs([]), {})
    })
    test('when list has only one blog', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(helper.listWithOneBlog), { author: 'Edsger W. Dijkstra', blogs: 1 })
    })
    test('of a bigger list', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(helper.blogList), { author: 'Robert C. Martin', blogs: 3 })
    })
})

describe('most likes', () => {
    test('when list is empty', () => {
        assert.deepStrictEqual(listHelper.mostLikes([]), {})
    })
    test('when list has only one blog', () => {
        assert.deepStrictEqual(listHelper.mostLikes(helper.listWithOneBlog), { author: 'Edsger W. Dijkstra', likes: 5 })
    })
    test('of a bigger list', () => {
        assert.deepStrictEqual(listHelper.mostLikes(helper.blogList), { author: 'Edsger W. Dijkstra', likes: 17 })
    })
})

const api = supertest(app)

describe('GET & POST /api/blogs', () => {
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

    after(async () => {
        await mongoose.connection.close()
    })
})