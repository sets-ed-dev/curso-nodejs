const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const employeeSchema = Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});


// Schema = Definition of a collection.
// Model = Representation of a collection on a certain programming language.
// Note: model(SingleOfCollectionName, SchemaDefinition).
module.exports = mongoose.model('Employee', employeeSchema);
