const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let usersWithTheSameName = users.filter((user) => {
    return user.username === username
  });
  return usersWithTheSameName.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(404).json({message: 'Error Logging In'})
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (!isbn || !review) {
    return res.status(400).json({ message: "Invalid request. ISBN and review are required." });
  }

  if (!req.session.authorization || !req.session.authorization.accessToken) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }
  const bookArray = Object.values(books);

  // Function to find a book by its ISBN
  function findBookByIsbn(isbn) {
    return bookArray.find(book => book.isbn === isbn);
  }

  // Function to add a book review
  function addBookReview(isbn, review) {
    const book = findBookByIsbn(isbn);

    if (!book) {
      return false; // Book not found
    }

    if (!book.reviews) {
      book.reviews = [];
    }

    book.reviews.push(review);
    return true; // Review added successfully
  }

  // Check if the book exists and add the review
  const reviewAdded = addBookReview(isbn, review);

  if (reviewAdded) {
    return res.status(200).json({ message: "Book review added successfully." });
  } else {
    return res.status(404).json({ message: "Book not found. Unable to add review." });
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username; // Assuming you have the username in the session

  if (!isbn || !username) {
    return res.status(400).json({ message: "Invalid request. ISBN and username are required." });
  }

  const book = findBookByIsbn(isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user has a review
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ message: "User review not found. Unable to delete." });
  }

  // Remove the user's review
  delete book.reviews[username];

  return res.status(200).json({ message: "User review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
