const employeesDataPath = '../models/employees.json';
const NOT_FOUND_HTTP_STATUS = 400;
const CREATED_HTTP_STATUS = 201;
const data = {
    employees: require(employeesDataPath),
    setEmployees: function (data) { this.employees = data; }
};


const getAllEmployees = (req, res) => {
    res.json(data.employees);
}

const createEmployee = (req, res) => {
    const lastRecord = data.employees[data.employees.length - 1];
    
    const newEmployee = {
        id: lastRecord.id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(NOT_FOUND_HTTP_STATUS)
            .json({'message': '"firstname" & "lastname" are required!'});
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(CREATED_HTTP_STATUS).json(data.employees);
}

const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    if (!employee) {
        res.status(NOT_FOUND_HTTP_STATUS)
            .json({'message': `Employee with ID = ${req.body.id} not found!`})
    }

    if (req.body.firstname)
        employee.firstname = req.body.firstname;
    if (req.body.lastname)
        employee.lastname = req.body.lastname;

    const otherEmployees = data.employees.filter(emp => emp.id !== employee.id);
    const currentEmployees = [...otherEmployees, employee];
    data.setEmployees(currentEmployees.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employees);
}

const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    if (!employee) {
        res.status(NOT_FOUND_HTTP_STATUS)
            .json({'message': `Employee with ID = ${req.body.id} not found!`})
    }

    const otherEmployees = data.employees.filter(emp => emp.id !== employee.id);
    const currentEmployees = [...otherEmployees];
    data.setEmployees(currentEmployees);
    res.json(data.employees);
}

const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));

    if (!employee) {
        res.status(NOT_FOUND_HTTP_STATUS)
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
