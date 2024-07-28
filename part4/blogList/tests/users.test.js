const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')

const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.userList.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

test('GET /api/users: correct Content-Type and length', async () => {
    const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, helper.userList.length)

})

test('POST /api/users: bad request due password', async () => {
    const newUser = {
        username: 'test',
        name: 'test',
        password: '12'
    }

    const resposne = await api.post('/api/users')
        .send(newUser)
        .expect(400)
    assert.strictEqual(resposne.body.error, 'password must be at least 3 characters long')
})

test('POST /api/users: bad request due username', async () => {
    const newUser = {
        username: 'te',
        name: 'test',
        password: '123'
    }

    const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)
    assert.strictEqual(response.body.error, 'User validation failed: username: Path `username` (`te`) is shorter than the minimum allowed length (3).')
})

test('POST /api/users: bad request due username already taken', async () => {
    const newUser = {
        username: 'root',
        name: 'test',
        password: '123'
    }

    const response = await api.post('/api/users')
        .send(newUser)
        .expect(400)
    assert.strictEqual(response.body.error, 'expected `username` to be unique')
})

after(() => {
    mongoose.connection.close()
})
