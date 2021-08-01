const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const { connectDb } = require('./models/index');
const userRoute = require('./routes/user.route');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
///// CONFIGURATION OF MORGAN //////////
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

userRoute(app);

connectDb()
  .then(() => {
    const listener = app.listen(process.env.PORT, function () {
      console.log('Your app is listening on port ' + listener.address().port);
      console.log('Connection established');
    });
  })
  .catch((error) => {
    console.log(error);
  });
