var _ = require('lodash');

module.exports = function(options) {

    options = _.merge({
        options : function(req, res, next){
            if (req.method == 'OPTIONS') {
                res.status(200).end();
            } else {
                next();
            }
        },
        allow : {
            origin: '*',
            methods: 'GET,PATCH,PUT,POST,DELETE,HEAD,OPTIONS',
            headers: 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override'
        },
        expose :{
            headers : null
        },
        max : {
            age : null
        },
        specials : {
            powered : null
        }
    }, options);

    return function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', options.allow.origin);
        res.setHeader('Access-Control-Allow-Methods', options.allow.methods);
        res.setHeader('Access-Control-Allow-Headers', options.allow.headers);
        if (options.expose.headers) {
            res.setHeader('Access-Control-Expose-Headers', options.expose.headers);
        }
        if (options.max.age) {
            res.setHeader('Access-Control-Max-Age', options.max.age);
        }

        switch(options.specials.powered) {
            case null:
                break;
            case false:
                res.removeHeader("X-Powered-By");
                break;
            default:
                res.setHeader('X-Powered-By', options.specials.powered);
        }

        if (req.method == 'OPTIONS' && options.options) {
            return options.options(req, res, next);
        } else {
            return next();
        }
    };
};