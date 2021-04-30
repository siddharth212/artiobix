
const mongoose = require('mongoose'); 
const port = process.env.PORT || 8000;
const path = require('path');
const dotenv = require("dotenv");

const { engine } = require('express-edge');
const express = require('express');
const edge = require("edge.js");

mongoose.set('useCreateIndex', true);
const bodyParser = require('body-parser');
dotenv.config()

const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const Post = require('./database/models/Post');

const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');

const logoutController = require("./controllers/logout");
const connectMongo = require('connect-mongo');


const app = new express();

const URI = "mongodb+srv://dbUser:dbUser@cluster0.tmwbb.mongodb.net/artobase?retryWrites=true&w=majority";
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))


    const mongoStore = connectMongo(expressSession);
 
app.use(expressSession({
    secret: 'secret',
    resave :false,
    saveUninitialized: true,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(fileUpload());

app.use(express.static(__dirname + '/public'));

app.use(engine);
app.set('views', __dirname + '/views');

app.use('*', (req, res, next) => {
  edge.global('auth', req.session.userId)
  next()
});




app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


const storePost = require('./middleware/storePost')
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
app.use('/posts/store', storePost)
 



app.get('/about', (req, res) => {
    
    res.render('about')
  });


app.get('/contact', (req, res) => {
    
    res.render('contact')
  });

  app.get("/", homePageController);
  app.get("/post", createPostController);
  app.post("/store", storePostController);
 
  app.post('/log',redirectIfAuthenticated, loginUserController);
  app.get("/reg", redirectIfAuthenticated,createUserController);
  app.post("/user",redirectIfAuthenticated, storeUserController);
  app.get("/logout", logoutController);

  app.get('/login',redirectIfAuthenticated, loginController);
  app.get("/:id", getPostController);
 


  
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});