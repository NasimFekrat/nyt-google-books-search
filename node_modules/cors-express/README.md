# cors-express

Middleware to control CORS in an Express app

## Installation

The best way to install it is using **npm**

```sh
npm install cors-express --save
```

## Loading

```js
var cors = require('cors-express');
```

## Initialization and Usage

```js
var app = express(),
    options = {};

app.use(cors(options));
```

## Options

```js
{
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
options : function(req, res, next){
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
},
specials : {
    powered : null
}
```
### Options

This method override the normal use of the "option" method and return OK with seted CORS headers

### Specials

#### Powered

Can change the "x-powered-by" header. You can use:

* **null** show original header: "Express"
* **false** doesn't show the header: "Express
* **string** show your own string


## Support

This plugin is proudly supported by [Kubide](http://kubide.es/) [hi@kubide.es](mailto:hi@kubide.es)

