const jwtSecret = "your_jwt_secret"; //This has to be
//the same key used in the JWTStrategy

const jwt = require("jsonwebtoken");
const passport = require("passport");

require("../helpers/passport"); //Local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.userName, //This is the username
    //we're encoding in the JWT
    expiresIn: "7d", //This specifies that
    //the token will expire in 7 days
    algorithm: "HS256" //This is the algorithm used
    //to "sign" or encode the values of the JWT
  });
}

//POST Login
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", {session: false}, (error, user, info) =>{
      if(error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user
        });
      }
      req.login(user, {session: false}, (error) => {
        if(error){
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({user, token});
      });
    })(req, res);
  });
}