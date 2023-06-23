// ==============================================
// TOOLS
// ==============================================
// -------------import env variable manager
import "dotenv/config";

// -------------import express framework
import express from "express";
const app = express();

// -------------import the session's management tool
import session from "express-session";

// -------------import the routes manager
import router from './routes/router.js';


// ==============================================
// MIDDLEWARE
// ==============================================

// -------------enable the use of json to recieve data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


// -------------set public as static folder where ejs retrieve assets
app.use(express.static("public"));

// -------------set views as ejs template
app.set("views", "./views");


// -------------session management middleware

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: 
    {
        secure: false,
        maxAge: 30*60*1000
        
    }
    
}));

// -------------session's middleware for account status
app.use(function (req,res,next)
{
    res.locals.user = req.session.user ? true : false;
    
    next();
    
});


// -------------session's middleware for clients account's id
app.use((req,res,next)=>
{
    if(req.session.user) res.locals.user = req.session.user;
    
    next();
    
});


// ==============================================
// SERVER LAUNCHING
// ==============================================

// -------------set the router call, this must be after all the middleware set up!!
app.use("/", router);


const PORT = process.env.PORT;


app.listen(PORT,()=>
{
    console.log("serveur listening port"+PORT+"/");
});


