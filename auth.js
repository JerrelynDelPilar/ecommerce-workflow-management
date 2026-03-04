const jwt = require('jsonwebtoken');
// [SECTION] Environment Setup
require('dotenv').config();

module.exports.createAccessToken = (user) => {
	// The data will be received from the registration form
	// When the user logs in, a token will be created with user's information
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// Generates JSON web token using the jwt's sign method
	// Generates the token using the form data and the secret code with no additional options provided
	// SECRET_KEY is a User defined string data that will used to create our JSON Web Tokens
	// Used in the algorithm for encrypting our data which makes it difficult to decode the information without the defined secret keyword
	// Since this is a critical data, we will use the .env to secure the secret key. "Keeping your secrets secret"
	return jwt.sign(data, process.env.JWT_SECRET_KEY, {})

}

module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.send({ auth: "Failed. No Token" })
	}else{
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

		// [SECTION] Token Decryption
		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){
			if(err){

				return res.status(403).send({
					auth: "Failed",
					message: err.message
				});
			
			}else{

				console.log("result from verifiy method:")
				console.log(decodedToken);

				req.user = decodedToken;

				// next() is an expressJS function which allows us to move to the next function in the route. It also passes details of the request and response to next function/middleware
				next();
			}
		})
	}
}

module.exports.verifyAdmin = (req, res, next) => {

	// console.log('result from verifyAdmin method');
	// console.log(req.user);
	if(req.user.isAdmin){
		next();
	}else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}

}


module.exports.errorHandler = (err, req, res, next) => {
	// Logs the error
	console.error(err);

	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error'; 
	res.status(statusCode).json({
		
		error: {
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}

	})

}

module.exports.isLoggedIn = (req, res, next) => {
	if(req.user) {
		next();
	} else {
		res.sendStatus(401);
	}
}