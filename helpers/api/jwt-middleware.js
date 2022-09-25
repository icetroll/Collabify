const { expressjwt: jwt } = require("express-jwt");
const util = require('util');
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    const middleware = jwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        path: [
            '/api/oauth',
        ]
    });

    return util.promisify(middleware)(req, res);
}