const passport = require("passport"),
localStrategy = require("passport-local").Strategy,
models = require("../database/models.js"),
passportJWT = require("passport-jwt");

let User = models.User,
JWTStrategy = passportJWT.Strategy,
ExtractJWT = passportJWT.ExtractJwt;

// Basic HTTP Authenitication
passport.use(new localStrategy({
  usernameField: "userName",
  passwordField: "password"
}, (username, password, callback) => {
  console.log(username);
  // Check if username is found in DB
  User.findOne({userName: username}, (error, user) =>{
  // Callback error message
    if(error){
      console.log(error);
      return callback(error);
    }
    if(!user){
      console.log("Incorrect username");
      return callback(null, false, {message: "Incorrect username or password."});
    }

    if(!user.validatePassword(password)){
      console.log("Incorrect password");

      console.log(user)
      console.log(password)
            return callback(null, false, {message: "Incorrect password."});
    }

    console.log("Finished");
    return callback(null, user);
  });
}));

// JWT Authentication
passport.use(new JWTStrategy({
  // Bearer Token
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // SecretKey
  secretOrKey: "your_jwt_secret"
}, (jwtPayload, callback) => {
  return User.findById(jwtPayload._id)
  .then((user) => {
    return callback(null, user);
  })
  .catch((error) => {
    return callback(error)
  });
}));
