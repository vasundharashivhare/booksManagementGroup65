const express = require('express');
const router = express.Router();
const UserController = require("../controllers/userController");
const BookController = require("../controllers/bookController");
const {authentication,authorisation}= require("../middleware/mw");



router.post("/register", UserController.createUser);

router.post("/login", UserController.login);

router.post("/books", authentication, authorisation, BookController.createBooks);

router.get("/books", authentication, BookController.getBooks);

router.get("/books/:bookId", authentication, BookController.getBooksById);

// router.put("/books/:bookId", mw.authentication, mw.authorisation, BookController.updateBooks);

// router.delete("/books/:bookId", mw.authentication, mw.authorisation, BookController.deleteBooks);

// router.post("/books/:bookId/review", ReviewController.createReview);

// router.put("/books/:bookId/review/:reviewId", ReviewController.updateReview);

// router.delete("/books/:bookId/review/:reviewId", ReviewController.deleteReview);



module.exports = router;