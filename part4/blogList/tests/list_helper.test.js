const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const app = require('../app')

const Blog = require('../models/blog')
beforeEach(async () => {
    await Blog.deleteMany({})
  
    const blogObjects = helper.blogList.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })


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
        assert.strictEqual(result , 5)
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

describe('', () => {
    test('get innitial blogs', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.blogList.length)

    })
    after(async () => {
        await mongoose.connection.close()
    })
})