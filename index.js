const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
var Person = require("./models/person");
const app = express();

morgan.token("body", function (req, res) {
    return JSON.stringify(req.body);
});

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

// ROUTING

// GET ALL
app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        return response.json(persons);
    });
});

// GET 1 by ID
app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((err) => next(err));
});

// PUT - CHANGE INFO BY ID
app.put("/api/persons/:id", (req, res, next) => {
    const { name, number } = req.body;
    const person = {
        name,
        number,
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then((updatedPerson) => {
            if (updatedPerson) {
                res.json(updatedPerson);
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => next(err));
});

// Delete ONE BY ID
app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((err) => next(err));
});

// CREATE NEW ENTRY IN PHONEBOOK
app.post("/api/persons", (req, res, next) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res
            .status(400)
            .json({ error: "Name and number fields are mandatory." });
    }

    const person = new Person({
        name,
        number,
    });

    person
        .save()
        .then((savedPerson) => {
            res.json(savedPerson);
        })
        .catch((error) => next(error));
});

// GET INFO HOW MANY IN PHONEBOOK
app.get("/api/info", (request, response) => {
    const date = new Date();
    Person.find({}).then((persons) => {
        response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
            `);
    });
});

// app.post("/api/persons", (req, res) => {
//     const { name, number } = req.body;
//     const id = generateID();

//     if (!name || !number) {
//         return res
//             .status(400)
//             .json({ error: "Name and number fields are mandatory." });
//     }

//     if (persons.some((p) => p.name === name)) {
//         return res.status(400).json({ error: "Name is already in phonebook." });
//     }

//     const newPerson = {
//         name,
//         number,
//         id,
//     };
//     persons = persons.concat(newPerson);
//     res.json(newPerson);
// });

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
