const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
    .connect(url)
    .then((res) => {
        console.log(`Connected to MongoDB...`);
    })
    .catch((err) => {
        console.log(`Problem connecting to MongoDB...`);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 9,
        validate: {
            validator: function(v) {
              return /\d{2,3}-\d+/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
          required: [true, 'User phone number required']

    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);


