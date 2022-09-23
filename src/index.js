const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://project53intern:yc9wXstVJBscHUUB@group64database.2cmd7u7.mongodb.net/group_53", {
    useNewUrlParser: true   
})
    .then(() => console.log('mongodb is Connected'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});

