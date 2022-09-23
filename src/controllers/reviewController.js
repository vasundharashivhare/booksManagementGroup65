const reviewModel = require("../models/reviewModel");
const bookModel = require("../models/bookModel")
const {isValid,isValidObjectId }=require("../validations/validation")



const createReviews = async function (req, res) {
    try {
      let body = req.body;
      let bookId = req.params.bookId;
       
      body.bookId = bookId;
      if (!body.reviewedBy) body.reviewedBy = "Guest";
      else {
        body.reviewedBy;
      }
      body.reviewedAt = new Date().toISOString();
  
      const review = await reviewModel.create(body);
  
      const newReview = {
        _id: review._id,
        bookId: bookId,
        reviewedBy: body.reviewedBy,
        reviewedAt: body.reviewedAt,
        rating: body.rating,
        review: body.review,
      };
      const book = await bookModel.findById({ _id: bookId });
      if (!book) return res.status(400).send({ status: false, message: "Book is not exist" });
  
      if (book.isDeleted) return res.status(404).send({ status: false, message: "Book is deleted" });
  
      const bookUpdateWithReviews = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },{ $inc: { reviews: 1 } },{ new: true }).select({ __v: 0 });

      bookUpdateWithReviews.reviewsData = newReview;
  
      const reviewsDetails = {...bookUpdateWithReviews.toJSON(),reviewsData: newReview,};return res.status(201).send({ status: true, message: "Success", data: reviewsDetails });

    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };



//--------------------------------------Upadte Review--------------------------------



const updateReview = async function (req, res) {  
  try {
      let data = req.body
      let bookId = req.params.bookId
      let reviewId = req.params.reviewId
      if (!isValid(bookId)) {
          return res.status(404).send({ messege: "Please provide  bookId" })
      }
      if (!isValidObjectId(bookId)) {
          res.status(400).send({ status: false, message: 'You Are Providing Invalid bookId' });
          return;
      }
      if (!isValid(reviewId)) {
          return res.status(404).send({ message: "Please provide reviewId " })
      }
      if (!isValidObjectId(reviewId)) {
          res.status(400).send({ status: false, message: 'You Are Providing Invalid reviewId' });
          return;
      }
      let bookFound = await bookModel.findOne({ _id: bookId, isDeleted: false })
      if (!bookFound) {
          return res.status(404).send({ message: "No book found" })
      }
      let checkReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
      if (!checkReview) {
          return res.status(404).send({ status: false, message: "The Review Doesn't Exist" })
      }
      if (bookFound && checkReview) {
          if (checkReview.bookId == bookId) {
              if (Object.keys(data).length == 0) {
                  return res.status(400).send({ message: "Please Provide The Required data" })
              }

              const { reviewedBy, review, rating } = data
              if (reviewedBy) {
                  if (!isValid(reviewedBy)) {
                      return res.status(404).send({ message: "Please provide The reviewer's name" })
                  }
              }
              if (review) {
                  if (!isValid(review)) {
                      return res.status(404).send({ message: "Please Provide Your Review" })
                  }
              }
              if (rating) {
                  if (!isValid(rating)) {
                      return res.status(404).send({ message: "Please Enter Rating" })
                  }
                  if (rating < 1 || rating > 5) {
                      return res.status(400).send({ status: false, message: "Rating Value Should Be In Between 1 to 5" })
                  }
              }

              const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { ...data }, { new: true }).select({ __v: 0 })
              return res.status(200).send({ status: true, message: 'Review updated', data: updatedReview });
          }
          else {
              return res.status(400).send({ status: false, message: "You Are Not Authorized To Update The review" })
          }
      } else {
          return res.status(400).send({ status: false, message: "can't find book to review " })
      }
  } catch (error) {
      res.status(500).send({ status: false, message: error.message });
  }
}


//-----------------Delete Review Api----------------------------------//


const deleteReview = async function (req, res) {
  try {
      let bookId = req.params.bookId
      let reviewId = req.params.reviewId

      if (Object.keys(bookId) == 0) { return res.status(400).send({ status: false, message: "Please provide book Id" }) }

      if (Object.keys(reviewId) == 0) { return res.status(400).send({ status: false, message: "please provide review Id" }) }

      if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: 'please provide a valid Book id' }) }

      if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: 'please provide a valid Review id' }) }

      const findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
      if (!findBook) { return res.status(404).send({ status: false, message: "No Book Is Present with this id" }) }

      const findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
      if (!findReview) { return res.status(404).send({ status: false, message: "No Review Is Present with this id" }) }

      if (findBook.isDeleted == true) { return res.status(400).send({ status: false, message: "Book has already been deleted" }) }

      if (findReview.isDeleted == true) { return res.status(400).send({ status: false, message: "Review has already been deleted" }) }

      const deleteReviewDetails = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deletedAt: new Date() }, { new: true })

      const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

      return res.status(200).send({ status: true, message: "Review deleted successfully.", data: deleteReviewDetails })



  }
  catch (error) {
      console.log(err)
      res.status(500).send({ status: false, message: error.message })
  }
}



module.exports={createReviews,updateReview,deleteReview}