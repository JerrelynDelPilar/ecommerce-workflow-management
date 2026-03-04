const express = require("express");
const mongoose = require("mongoose");
// Allows our backend application to be available in our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");


//[SECTION] Routes
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

// [SECTION] Environment Setup
require('dotenv').config();

const app = express();

// const port = 4000;

// Connecting to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);

// If the connection is successful, output in the console
mongoose.connection.once("open", () => console.log("We're connected to the cloud database"));

// Setup for allowing the server to handle data from requests
// Allows your app to read json data
app.use(express.json());
// Allows your app to read data from forms
app.use(express.urlencoded({extended:true}));

const port = 3000;

// You can also customize the CORS options to meet your specific requirements
const corsOptions = {
	// Allow request from this origin (the client's URL) the origin is in array form if there are multiple origins
	origin: ['http://localhost:3000', 'http://localhost:8000', 'http://zuitt-bootcamp-prod-521-8375-bautista.s3-website.us-east-1.amazonaws.com', 'http://zuitt-bootcamp-prod-521-8331-delpilar.s3-website.us-east-1.amazonaws.com'],
	// Allow only specified HTTP methods, optional only if you want to restrict the methods
	// methods: ['GET', 'POST'],

	// Allow only specified headers, optional only if you want to restrict headers
	// allowedHeaders: ['Content-Type', 'Authorization'],

	// Allows crendentials (e.g. cookies, authorization headers)
	credentials: true,

	// Provides status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204.
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


//[SECTION] Backend Routes 
app.use("/b2/users", userRoutes);
app.use("/b2/products", productRoutes);
app.use("/b2/cart", cartRoutes);
app.use("/b2/orders", orderRoutes);

if(require.main === module){
	app.listen(process.env.PORT || port, () => console.log(`Server running at port ${process.env.PORT || port}`));
}

module.exports = {app,mongoose};
