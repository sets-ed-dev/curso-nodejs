const express = require('express');
const employessController = require('../../controllers/employeesController');


// In this route, we simulate API endpoint called /employees.
const router = express.Router();
const rootRouteEmployees = '/';

// 10. We can call the route so we can redirect different
// behavior about the request's methods.
router.route(rootRouteEmployees)
    // GET: All employees.
    .get(employessController.getAllEmployees)
    // POST: Simulate new employee creation & answer with record data.
    .post(employessController.createEmployee)
    // PUT: Update an employee.
    .put(employessController.updateEmployee)
    // DELETE: Simulate employee deletion by Id, answering with requested Id.
    .delete(employessController.deleteEmployee);

// 11. Getting requested parameters of route.
router.route('/:id')
    // GET: Simulate getting of individual employee.
    .get(employessController.getEmployee);


module.exports = router;
