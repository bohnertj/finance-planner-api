const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/api/v1/invoice',
            '/api/v1/invoice/categories',
            '/api/v1/invoice/invoicebydate',
            '/api/v1/invoice/test',
            '/api/v1/salary',
            '/api/v1/salary/categories',
            '/api/v1/salary/salarybydate',
            '/api/v1/salary/test',
            '/favicon.ico',
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};