
//[SECTION] Dependencies and Modules
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../auth');

const { errorHandler } = auth;


module.exports.getUserDetails = (req, res) => {
	User.findById(req.user.id)
	.then(user => {
		if (!user) {
			return res.status(404).send({ error: 'User not found' });
		}
		user.password = "";
		res.status(200).send({user: user});
	})
	.catch(error => errorHandler(error, req, res));
};


module.exports.setAsAdmin = (req, res) => {

	let updateAdminField = {
		isAdmin: true
	};

	User.findByIdAndUpdate(req.params.userId, updateAdminField)
	.then(user => {
		if (user) {
			return res.status(200).send({ updatedUser: user });
		} else {
			return res.status(404).send({ message: 'User not found' });
		}
	})
	.catch(error => errorHandler(error, req, res));
};

module.exports.updatePassword = async (req, res) => {
	try {
		const { newPassword } = req.body;
		const {id} = req.user

		if (!newPassword) {
			return res.status(400).json({ message: 'New password is required' });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);


		await User.findByIdAndUpdate(id, { password: hashedPassword });

		res.status(200).json({ message: 'Password reset successfully' });

	} catch (error) {
		console.error('Password reset error:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}

};

// Register User
module.exports.registerUser = (req, res) => {
    // Checks if the email is in the right format
	if (!req.body.email.includes("@")){
		return res.status(400).send({ error: "Email invalid" });
	}
    // Checks if the mobile number has the correct number of characters
	else if (req.body.mobileNo.length !== 11){
		return res.status(400).send({ error: "Mobile number invalid" });
	}
    // Checks if the password has atleast 8 characters
	else if (req.body.password.length < 8) {
		return res.status(400).send({ error: "Password must be atleast 8 characters" });
    // If all needed requirements are achieved
	} else {
		let newUser = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			mobileNo : req.body.mobileNo,
			password : bcrypt.hashSync(req.body.password, 10)
		})

		return newUser.save()
		.then((result) => res.status(201).send({ message: "Registered Successfully" }) )
		.catch(error => errorHandler(error, req, res));
	}
};


// Log-In User
module.exports.loginUser = (req, res) => {
	if(req.body.email.includes("@")){
		return User.findOne({ email : req.body.email })
		.then(result => {
			if(result == null){
				return res.status(404).send({ error: "No Email Found" });
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
				if (isPasswordCorrect) {
					return res.status(200).send({ access : auth.createAccessToken(result)});
				} else {
					return res.status(401).send({ error: "Email and password do not match" });
				}
			}
		})
		.catch(error => errorHandler(error, req, res));
	}else{
		return res.status(400).send({ error: "Invalid Email" });
	}
};