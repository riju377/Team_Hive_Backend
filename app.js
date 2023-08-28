const express = require('express');
const app = express();
const mongoose = require('mongoose')
const userRoute = require('./routes/user')
const compRoute = require('./routes/competition')
const cors = require('cors')
const bodyParser = require('body-parser');

require("dotenv").config();


app.use(cors());
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to DB'))
    .catch((e) => console.log(e))

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Home')
})

app.use('/user', userRoute)
app.use('/comp', compRoute)

app.listen(3000, () => {
    console.log("Connected")
})