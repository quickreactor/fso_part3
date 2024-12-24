const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(cors());
app.use(express.static('dist'))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

const generateID = () => {
    let id = Math.floor(Math.random() * 100000);
    return id;
};


app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find((p) => p.id === id);
    if (person) {
        response.json(person);
    } else {
        response.sendStatus(404);
    }
});

app.get("/api/info", (request, response) => {
    const date = new Date();
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `);
});

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body;
    const id = generateID();

    if (!name || !number) {
        return res
            .status(400)
            .json({ error: "Name and number fields are mandatory." });
    }

    if (persons.some((p) => p.name === name)) {
        return res.status(400).json({ error: "Name is already in phonebook." });
    }

    const newPerson = {
        name,
        number,
        id,
    };
    persons = persons.concat(newPerson);
    res.json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    persons = persons.filter((n) => n.id !== id);
    response.sendStatus(204);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
