const express = require('express');


// In this route, we simulate API endpoint called /employees.
const router = express.Router();
const rootRouteEmployees = '/';
const employeesDataPath = '../../data/employees.json'
let data = {};
data.employees = require(employeesDataPath);

// 10. We can call the route so we can redirect different
// behavior about the request's methods.
router.route(rootRouteEmployees)
    // GET: All employees.
    .get((req, res) => {
        res.json(data.employees);
    })
    // POST: Simulate new employee creation & answer with record data.
    .post((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    // PUT: Same case as POST method.
    .put((req, res) => {
        res.json({
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });
    })
    // DELETE: Simulate employee deletion by Id, answering with requested Id.
    .delete((req, res) => {
        res.json({
            "id": req.body.id
        });
    });

// 11. Getting requested parameters of route.
router.route('/:id')
    // GET: Simulate getting of individual employee.
    .get((req, res) => {
        res.json({
            "id": req.params.id
        });
    });


module.exports = router;
