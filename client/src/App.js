import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Menu from "./components/Menu";
import Search from "./components/Search";
import Books from "./components/Books";
import BookList from "./components/BookList";
import Highlight from "./components/Highlight";
import idb from 'idb';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        null
      ],
      queryObject: {
        type: 'q=intitle:',
        query: 'lord+of+the'
      },
      highlight: 0,
      visibility: {
        highlight: false,
        booklist: false,
        books: false
      },
      books: [
        null
      ]
    }
    this.updateQuery = this.updateQuery.bind(this);
    this.updateHighlight = this.updateHighlight.bind(this);
    this.addBook = this.addBook.bind(this);
    this.updateBookHighlight = this.updateBookHighlight.bind(this);
    this.updateVisibility = this.updateVisibility.bind(this);
    this.removeBook = this.removeBook.bind(this);
  }

  // Get the results for the search terms entered
  fetchQuery() {
    
    this.serverRequest = fetch('https://www.googleapis.com/books/v1/volumes?' + this.state.queryObject.type + this.state.queryObject.query)
      .then(response => response.json())
      .then((data) => {
        data.items.forEach((item, i) => {
          let element = {};
          if (typeof item.volumeInfo.title != 'undefined') {
            element.title = item.volumeInfo.title;
          } else {
            element.title = null;
          }
          if (typeof item.volumeInfo.authors != 'undefined') {
            element.authors = item.volumeInfo.authors[0];
          } else {
            element.authors = null;
          }
          if (typeof item.volumeInfo.averageRating != 'undefined') {
            element.rating = item.volumeInfo.averageRating;
          } else {
            element.rating = null;
          }
          if (typeof item.volumeInfo.ratingsCount != 'undefined') {
            element.ratingsCount = item.volumeInfo.ratingsCount;
          } else {
            element.ratingsCount = null;
          }
          if (typeof item.volumeInfo.publisher != 'undefined') {
            element.publisher = item.volumeInfo.publisher;
          } else {
            element.publisher = null;
          }
          if (typeof item.volumeInfo.publishedDate != 'undefined') {
            element.publishedDate = item.volumeInfo.publishedDate;
          } else {
            element.publishedDate = null;
          }
          if (typeof item.volumeInfo.description != 'undefined') {
            element.description = item.volumeInfo.description;
          } else {
            element.description = null;
          }
          if (typeof item.volumeInfo.imageLinks != 'undefined' &&
            typeof item.volumeInfo.imageLinks.thumbnail != 'undefined') {
            element.thumbnail = item.volumeInfo.imageLinks.thumbnail.replace(/http:/i, 'https:');

          } else {
            element.thumbnail = null;
          }
          if (typeof item.saleInfo.listPrice != 'undefined') {
            element.price = item.saleInfo.listPrice.amount;
          } else {
            element.price = null;
          }
          if (typeof item.saleInfo.buyLink != 'undefined') {
            element.purchase = item.saleInfo.buyLink;
          } else {
            element.price = null;
          }
          if (typeof item.volumeInfo.description != 'undefined') {
            element.description = item.volumeInfo.description;
          } else {
            element.description = null;
          }
          this.setState(this.state.items.splice(i, 1, element));
        })
      }).catch((err) => {
        console.error('There was an error fetching data', err);
      });
  }

  componentDidMount() {
    // Populate the books list
    axios.get('/api/books')
      .then(response => {
        console.log('Fetched from mongo', response.data);
        this.setState({
          books: response.data
        })
      }).catch(err => {
        console.error(err);
      });

    // Offline
    if (!window.navigator.onLine) {
      setTimeout(function () { alert('You appear to be offline. Your books are still avaiable to you'); }, 1);
      // Open IDB
      const dbPromise = idb.open('books', 1, upgradeDB => {
        // Create an object store named weather if none exists
        //eslint-disable-next-line	
        let books = upgradeDB.createObjectStore('books');
      }).catch(error => {
        console.error('IndexedDB:', error);
      });
      //Get all the books
      dbPromise.then(db => {
        return db.transaction('books')
          .objectStore('books').getAll();
      }).then(allObjs => {
        this.setState({
          books: allObjs,
          visibility: {
            highlight: false,
            booklist: false,
            books: true
          }
        });
      });
    }
  }

  // componentWillUnmount() {
  // 	this.serverRequest.abort();
  // }

  // Set the current query in state on change
  updateQuery(queryObject) {
    this.setState({
      queryObject: {
        type: queryObject.type,
        query: queryObject.query
      },
      visibility: {
        highlight: false,
        booklist: true,
        books: false
      }
    }, () => {
      this.fetchQuery();
    });

  }

  // Show all the data pertaining to an item
  updateHighlight(highlight) {
    this.setState({
      highlight: highlight.highlight,
      visibility: {
        highlight: true,
        booklist: true,
        books: false
      }
    });

  }

  updateBookHighlight(highlight) {
    this.setState({
      highlight: highlight.highlight,
      visibility: {
        highlight: true,
        booklist: false,
        books: true
      }
    });


  }

  addBook(data) {
    // Add to state	
    this.setState({
      items: this.state.items.filter((item, i) => i !== this.state.highlight),
      visibility: {
        highlight: false,
        booklist: false,
        books: true
      },
      books: [...this.state.books, data]
    });

    // Open IDB
    const dbPromise = idb.openDb('books', 1, upgradeDB => {
      // Create an object store if none exists
      //eslint-disable-next-line	
      let books = upgradeDB.createObjectStore('books');
    }).catch(error => {
      console.error('IndexedDB:', error);
    });

    // Add Book to IDB
    dbPromise.then(db => {
      let tx = db.transaction('books', 'readwrite');
      let books = tx.objectStore('books', 'readwrite');
      books.add(data, data.title);
    }).catch(error => {
      console.error('IndexedDB:', error);
    });

    // Add Book to mongoDB
    axios.post('/api/books', data)
      .then(function (res) {
        console.log(res);
      })
      .catch(function (err) {
        console.log(err);
      });

  }

  removeBook(data) {
    const remove = this.state.books;
    remove.splice(this.state.highlight, 1);
    this.setState({
      visibility: {
        highlight: false,
        booklist: false,
        books: true
      },
      books: [...remove]
    });
    const dbPromise = idb.open('books', 1, upgradeDB => {
      // Create an object store named weather if none exists
      //eslint-disable-next-line	
      let books = upgradeDB.createObjectStore('books');
    }).catch(error => {
      console.error('IndexedDB:', error);
    });
    dbPromise.then(db => {
      let tx = db.transaction('books', 'readwrite');
      let books = tx.objectStore('books', 'readwrite');
      books.delete(data.title);
    }).catch(error => {
      console.error('IndexedDB:', error);
    })

    axios.delete(`/api/books/${data._id}`, data)
      .then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.error(err);
      })
  }

  // Set state for which parts of the UI are visible
  updateVisibility(setVisibility) {
    this.setState({
      visibility: {
        highlight: setVisibility.highlight,
        booklist: setVisibility.booklist,
        books: setVisibility.books
      }
    });

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">NYT Google Books App!</h1>
        </header>
        
        <Menu setVisibility={this.updateVisibility}
					  visibility={this.state.visibility} />

        <Search queryObject={this.updateQuery} />

        <Highlight data={this.state.visibility.books ?
          this.state.books[this.state.highlight] :
          this.state.items[this.state.highlight]}
          visibility={this.state.visibility}
          addBook={this.addBook}
          removeBook={this.removeBook} />

        <BookList data={this.state.items}
          highlight={this.updateHighlight}
          visibility={this.state.visibility.booklist} />

        <Books data={this.state.books}
          highlight={this.updateBookHighlight}
          visibility={this.state.visibility.books} />

        <footer className="footer">
          <div className="container">
            <span className="text-muted">Copyright &copy; | <a href="https://github.com/NasimFekrat/nyt-google-books-search" onClick={this.handleClick}>GitHub Repo!</a></span>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
