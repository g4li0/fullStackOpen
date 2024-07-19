const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
}))

app.use(cors())

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error =>
            next(error)
        )
})

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
    //const person = request.body
    const { name, number } = request.body

    const person = new Person({
        name: name,
        number: number
    })

    person.save()
    .then(savedPerson => {
        response.status(201).json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    if (!name || !number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            }
            else {
                response.status(404).end()
            }

        })
        .catch(error => {
            next(error)
        })
})

app.get('/info', (request, response) => {

    Person.find({}).then(person => {
        response.send(`
            <p>Phonebook has info for ${person.length} people</p>
            <p>${new Date()}</p>
            `)
    })


})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})