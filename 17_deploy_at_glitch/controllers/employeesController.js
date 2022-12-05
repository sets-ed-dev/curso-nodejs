const Employee = require('../models/Employees');
const BAD_REQUEST_HTTP_STATUS = 400;
const CREATED_HTTP_STATUS = 201;
const NOT_CONTENT_HTTP_STATUS = 204;


const getAllEmployees = async (req, res) => {
    // That's the way you can select all.
    const employees = await Employee.find();

    if (!employees)
        return res.status(NOT_CONTENT_HTTP_STATUS)
                    .json({'message': 'There isn\'t any employee!'});

    res.json(employees);
}

const createEmployee = async (req, res) => {
    if (!req?.body?.firstName || !req?.body?.lastName) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
                    .json({'message': '"firstName" & "lastName" are required!'});
    }

    try {
	    await Employee.create({
	        firstName: req.body.firstName,
	        lastName: req.body.lastName,
	    });
	
	    res.status(CREATED_HTTP_STATUS)
	        .json(`${req.body.firstName} ${req.body.lastName} has been created!`);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': `Id parameter not found!`})
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec();

    if (!employee) {
        res.status(NOT_CONTENT_HTTP_STATUS)
            .json({'message': `Employee with id = ${req.body.id} not found!`})
    }

    if (req.body?.firstName)
        employee.firstName = req.body.firstName;
    if (req.body?.lastName)
        employee.lastName = req.body.lastName;

    const updateOk = await employee.save();

    res.json(updateOk);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': `Id parameter is required!`})
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec();

    if (!employee) {
        return res.status(NOT_CONTENT_HTTP_STATUS)
            .json({'message': `Employee with ID = ${req.body.id} not found!`})
    }

    // See at mongoose doc why exec() isn't needed here.
    const deleteOK = await Employee.deleteOne({_id: employee._id});
    
    res.json(deleteOK);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) {
        res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': `Id parameter is required!`})
    }

    const employee = await Employee.findOne({_id: req.params.id}).exec();

    if (!employee) {
        res.status(NOT_CONTENT_HTTP_STATUS)
            .json({'message': `Employee with ID = ${req.params.id} not found!`})
    }

    res.json(employee);
}


module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}
