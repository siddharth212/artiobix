const port = process.env.PORT || 8000;
const path = require('path');

const { engine } = require('express-edge');
const express = require('express');
const edge = require("edge.js");
//const mongoose = require('mongoose');
const mongoose = require('mongoose'); 
mongoose.set('useCreateIndex', true);
const bodyParser = require('body-parser');


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




mongoose.connect('mongodb://localhost:27017/artiodatabase', { useNewUrlParser: true, useUnifiedTopology: true })
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
//app.use(express.static('public'));
//app.use(express.static('pages'));
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

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

 
const storePost = require('./middleware/storePost')
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
app.use('/posts/store', storePost)
 

//const app = new express();
 
//app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.render('index');
// });

// app.get('/', async (req, res) => {
//     const posts = await Post.find({})
//     res.render('index', {
//         posts                           1
//     })
// });

app.get('/about', (req, res) => {
    
    res.render('about')
  });


app.get('/contact', (req, res) => {
    
    res.render('contact')
  });

  app.get("/", homePageController);
  
  

  app.get("/post", createPostController);

  app.post("/store", storePostController);

  app.get('/login',redirectIfAuthenticated, loginController);
  app.post('/log',redirectIfAuthenticated, loginUserController);
  app.get("/reg", redirectIfAuthenticated,createUserController);
  app.post("/user",redirectIfAuthenticated, storeUserController);
  app.get("/logout", logoutController);
  app.get("/:id", getPostController);


  

  
  
  

   

  


// app.get('/post', (req, res) => {
//     res.render('create')
// });


// app.post("/store", (req, res) => {
//     const {
//         image
//     } = req.files
 
//     image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
//         Post.create({
//             ...req.body,
//             image: `/posts/${image.name}`
//         }, (error, post) => {
//             res.redirect('/');
//         });
//     })
// });

// app.post('/store', (req, res) => {
//     Post.create(req.body, (error, post) => {
//         res.redirect('/')
//     })
// });

// app.get('/:id', async (req, res) => {
//     const post = await Post.findById(req.params.id)
//     res.render('post', {
//         post                    2
//     })
// });






 
// app.listen(4000, () => {
//     console.log('App listening on port 4000')
// });

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});