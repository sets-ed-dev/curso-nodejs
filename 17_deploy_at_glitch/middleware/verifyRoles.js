const UNAUTHORIZED_HTTP_STATUS = 401;


const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return res.sendStatus(UNAUTHORIZED_HTTP_STATUS);
        }

        const rolesArray = [...allowedRoles];
        
        const result = 
            req.roles
                .map(rol => rolesArray.includes(rol))
                .find(val => val === true);
        
        if (!result)
            return res.sendStatus(UNAUTHORIZED_HTTP_STATUS);

        next();
    }
}


module.exports = verifyRoles;
