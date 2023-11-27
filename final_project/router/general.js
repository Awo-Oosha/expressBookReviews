const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "Username is already taken. Please choose a different one." });
    }
  }

  return res.status(400).json({ message: "Unable to register user. Please provide valid username and password." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book_array = Object.values(books);
  let filtered_isbn = book_array.filter((book) => book.isbn === isbn);

  return res.status(200).json({filtered_isbn});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookArray = Object.values(books);
  const booksByAuthor = bookArray.filter(book => book.author === author);
  return res.status(200).json({booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookArray = Object.values(books);
  const booksByTitle = bookArray.filter(book => book.title === title);
  return res.status(200).json({booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookArray = Object.values(books)
  const booksByIsbn = bookArray.find(book => book.isbn === isbn);

  if(booksByIsbn) {
    const reviews = booksByIsbn.reviews;
    return res.status(200).json({ reviews });
  }
  return res.status(404).json({message: "Book Not Found!!!"});
});



// Import Axios and other necessary modules
const axios = require('axios');

// Task 10: Get the list of books available in the shop using Promise callbacks or async-await with Axios

// Using Promise callbacks
public_users.get('/', function (req, res) {
  axios.get('your_books_api_endpoint')
      .then(response => {
        const books = response.data;
        return res.status(200).json({ books });
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      });
});

// Using async-await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('your_books_api_endpoint');
    const books = response.data;
    return res.status(200).json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 11: Get book details based on ISBN using Promise callbacks or async-await with Axios

// Using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`your_books_api_endpoint/${isbn}`)
      .then(response => {
        const bookDetails = response.data;
        return res.status(200).json({ bookDetails });
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      });
});

// Using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`your_books_api_endpoint/${isbn}`);
    const bookDetails = response.data;
    return res.status(200).json({ bookDetails });
  } catch (error) {
    console.error('Error fetching book details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 12: Get book details based on Author using Promise callbacks or async-await with Axios

// Using Promise callbacks
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`your_books_api_endpoint?author=${author}`)
      .then(response => {
        const booksByAuthor = response.data;
        return res.status(200).json({ booksByAuthor });
      })
      .catch(error => {
        console.error('Error fetching books by author:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      });
});

// Using async-await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`your_books_api_endpoint?author=${author}`);
    const booksByAuthor = response.data;
    return res.status(200).json({ booksByAuthor });
  } catch (error) {
    console.error('Error fetching books by author:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Task 13: Get book details based on Title using Promise callbacks or async-await with Axios

// Using Promise callbacks
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`your_books_api_endpoint?title=${title}`)
      .then(response => {
        const booksByTitle = response.data;
        return res.status(200).json({ booksByTitle });
      })
      .catch(error => {
        console.error('Error fetching books by title:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      });
});

// Using async-await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`your_books_api_endpoint?title=${title}`);
    const booksByTitle = response.data;
    return res.status(200).json({ booksByTitle });
  } catch (error) {
    console.error('Error fetching books by title:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports.general = public_users;
