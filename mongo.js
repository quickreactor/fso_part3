const mongoose = require("mongoose");

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://quickreactor:${password}@cluster0.clzda.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = new mongoose.model("Person", personSchema);

if (!name && !number) {
    console.log("Phonebook:");
    Person.find({}).then((res) => {
        res.forEach((p) => {
            console.log(`${p.name} ${p.number}`);
        });
        mongoose.connection.close();
    });
} else {
    const person = new Person({
        name,
        number,
    });
    
    person.save().then(res => {
        console.log(`added ${JSON.stringify(res)}`);
        mongoose.connection.close();
    })
}

