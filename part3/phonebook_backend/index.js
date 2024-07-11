const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
//app.use(morgan('tiny'))
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

app.use(express.static('dist'))

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const count = persons.length
    persons = persons.filter(person => person.id !== id)
    if (persons.length < count) {
        response.status(204).end()
    } else {
        response.status(404).end();
    }

})

app.post('/api/persons', (request, response) => {
    //const person = request.body
    const { name, number } = request.body
    if (!name || !number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    else if (persons.find(person => person.name === name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    else {
        const newPerson = { id: Math.floor(Math.random() * 999999999).toString(), name, number }
        persons = persons.concat(newPerson)
        response.status(201).json(newPerson)
    }

})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})