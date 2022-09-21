const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
const {isValid,validanumber ,isValidEmail }=require("../validations/validation")


const createUser = async function (req, res) {
    try {
        let data = req.body
        const { title, name, phone, email, password } = data;

        // ------------------------ validation start -------------------------------
        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: 'No data provided' }) }

        if (!isValid(title)) { return res.status(400).send({ status: false, message: 'Title is required' }) }

        if (!(title.trim() == 'Mr' || title.trim() == 'Miss' || title.trim() == 'Mrs')) { return res.status(400).send({ status: false, message: 'Please provide an appropriate title' }) }

        if (!isValid(name)) { return res.status(400).send({ status: false, message: 'Name is required' }) }


        if (!isValid(phone)) { return res.status(400).send({ status: false, message: 'Phone Number is required' }) }

        if (!validanumber(phone)) { return res.status(400).send({ status: false, message: 'Please provide a valid phone number' }) }

        let isUniquephone = await userModel.findOne({ phone: phone })
        if (isUniquephone) { return res.status(400).send({ status: false, message: 'Phone number already exist' }) }


        if (!isValid(email)) { return res.status(400).send({ status: false, message: 'Email is required' }) }

        if (!isValidEmail (email)) { return res.status(400).send({ status: false, message: 'Please provide a valid email' }) }

        let isUniqueemail = await userModel.findOne({ email: email })
        if (isUniqueemail) { return res.status(400).send({ status: false, message: 'Email Id already exist' }) }

        if (!isValid(password)) { return res.status(400).send({ status: false, message: 'Password is required' }) }

        if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, message: 'Password should be of minimum 8 characters & maximum 15 characters' }) }
        //-----------------validation ends ---------------------------------

        const newUser = await userModel.create(data);
        return res.status(201).send({ status: true, message: 'User successfully created', data: newUser })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}


const login = async function (req, res) {
    try {
        const mail = req.body.email
        const pass = req.body.password
        const data = req.body

          // ------------------------ validation ends -------------------------------
        if (Object.keys(data) == 0) return res.status(400).send({ status: false, message: "No input provided" })

        if (!isValid(mail)) { return res.status(400).send({ status: false, message: "Email is required" }) }

        if (!isValidEmail(mail)) { return res.status(400).send({ status: false, message: 'Please provide a valid email' }) }

        if (!isValid(pass)) { return res.status(400).send({ status: false, message: "Password is required" }) }

        if (pass.length < 8 || pass.length > 15) { return res.status(400).send({ status: false, message: 'Password should be of minimum 8 characters & maximum 15 characters' }) }
        //validation ends

        const mailMatch = await userModel.findOne({ email: mail })
        if (!mailMatch) return res.status(400).send({ status: false, message: "Email is incorrect" })

        const passMatch = await userModel.findOne({ password: pass })
        if (!passMatch) return res.status(400).send({ status: false, message: "Password is incorrect" })
        //-----------------validation ends ---------------------------------

        // -------------------Token Will be Generate After 1st Log In ---------------
        const token = jwt.sign({
            userId: mailMatch._id.toString(), batch:"plutonium",
        }, "Project-3/group65" ,{ expiresIn: "24h" });

        res.setHeader("x-api-key", "token");
        return res.status(200).send({ status: true, message: "You are successfully logged in", token })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}

module.exports.createUser = createUser;
module.exports.login = login;