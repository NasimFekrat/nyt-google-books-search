const cors = require('cors-express');
const express = require("express");
const bodyParser = require("body-parser");
const Books = require("./books");

const PORT = 3001;
const app = express();
const router = express.Router();

const options = {
    allow: {
        origin: '*',
        methods: 'GET,PATCH,PUT,POST,DELETE,HEAD,OPTIONS',
        headers: 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override'
    },
}

// this is our MongoDB database
//require db connection
require('./models');

app.use(cors(options));
// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
// configure app to use bady parser to extract JSON from POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the UI over express server
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './client/public/'))
});

//Initialize API
router.get('/api', function (req, res) {
    res.send('API initialized');
});

//Register API routes
app.use('/api', router);

// Route for all records in collection
router.route('/books')
    // Add a favortie entry to the database
    .post(function (req, res) {
        console.log("we're here")
        // Create an entry
        const books = new Books();
        books.title = req.body.title,
            books.authors = req.body.authors,
            books.rating = req.body.rating,
            books.publisher = req.body.publisher,
            books.publishedDate = req.body.publishedDate,
            description = req.body.description,
            books.thumbnail = req.body.thumbnail,
            books.price = req.body.price,
            books.purchase = req.body.purchase;

        // Save the entry and check for errors
        books.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: 'Books added',
                    books: books
                });
            }
        })
    })

    // Retrieve all books from the database
    .get(function (req, res) {
        Books.find(function (err, books) {
            if (err) {
                res.send(err);
            } else {
                res.json(books);
            }
        });
    })

// Route for specific records
router.route('/books/:id')

    // Remove a record permanently
    .delete(function (req, res) {
        Books.remove({ _id: req.params.id }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Record Removed");
            }
        })
        res.status(204).end();
    })

// Start the API server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});