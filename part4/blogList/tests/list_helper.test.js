const { test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

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