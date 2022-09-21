const jwt = require("jsonwebtoken")
const bookModel = require("../models/bookModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "Token is not Found" })

        let decodedtoken = jwt.verify(token, "Secret-Key")
        if (!decodedtoken) return res.status(401).send({ status: false, msg: "token is invalid" })
        else next()
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
}

         

const authorisation = async (req, res, next) => {

    let token = req.headers["x-api-key"];
    let decodedtoken = jwt.verify(token, "Secret-Key")
        //Request Body
        if(decodedtoken.userId == req.body.userId) return next()
        else return res.status(401).send({ status: false, msg: "you are not authorised!!!" });

       
      if (req.params.bookId) {
        //Path Parameter
        let requiredId = await bookModel.findOne({ _id: req.params.bookId }).select({ userId: 1, _id: 0 })
        let userIdFromBook = requiredId.userId.toString()
        if(decodedtoken.userId == req.params.bookId) return next()   //userIdFromBook
        else return res.status(401).send({ status: false, msg: "Unauthorised!!!" });
       }
    req.loggedIn = decodedtoken.userId
    return next()
  
      };


module.exports.authentication = authentication;
module.exports.authorisation = authorisation;