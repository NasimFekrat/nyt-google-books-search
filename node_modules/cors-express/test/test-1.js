'use strict';
var chai = require("chai"),
    supertest = require('supertest'),
    should = chai.should(),
    express = require('express'),
    cors = require('../index'),
    app,
    options = {};


describe('basic usage', function () {
    //setup server
    before(function(){
        app = express();
        app.use(cors(options));
        app.get('/', function (req, res) {
            res.json('hello world');
        });
    });

    it('get default headers', function (done) {
        supertest(app)
            .get("/")
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.headers['access-control-allow-origin'].should.be.eql('*');
                res.headers['access-control-allow-methods'].should.be.eql('GET,PATCH,PUT,POST,DELETE,HEAD,OPTIONS');
                res.headers['access-control-allow-headers'].should.be.eql('Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override');
                res.headers['x-powered-by'].should.be.eql('Express');
               done();
            });
    });
});


describe('override usage', function () {
    //setup server
    before(function(){
        app = express();
        options = {
            options : function(req, res, next){
                if (req.method == 'OPTIONS') {
                    res.status(200).json("test data");
                } else {
                    next();
                }
            },
            allow : {
                origin: '*',
                methods: 'GET,OPTIONS',
                headers: 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override, x-kubide-header'
            },
            expose :{
                headers : "x-kubide-expose-header"
            },
            max : {
                age : '123'
            },
            specials : {
                powered : "Kubide powa"
            }
        };
        app.use(cors(options));
        app.get('/', function (req, res) {
            res.json('get method');
        });
        app.put('/', function (req, res) {
            res.json('put method');
        });
    });

    it('get override headers', function (done) {
        supertest(app)
            .get("/")
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.headers['access-control-allow-origin'].should.be.eql(options.allow.origin);
                res.headers['access-control-allow-methods'].should.be.eql(options.allow.methods);
                res.headers['access-control-allow-headers'].should.be.eql(options.allow.headers);
                done();
            });
    });


    it('specials one', function (done) {
        supertest(app)
            .get("/")
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.headers['access-control-expose-headers'].should.be.eql(options.expose.headers);
                res.headers['access-control-max-age'].should.be.eql(options.max.age);
                res.headers['x-powered-by'].should.be.eql(options.specials.powered);
                done();
            });
    });



    it('options', function (done) {
        supertest(app)
            .options("/")
            .send()
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.body.should.be.equal("test data");
                done();
            });
    });


});
