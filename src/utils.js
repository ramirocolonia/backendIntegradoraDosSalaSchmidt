import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const passportCall = (strategy) =>{
  return (req, res, next) =>{
    passport.authenticate(strategy, function(error, user, info) {
      if(error) return next(error);
      if(!user){
        return res.status(401).send({error: info.messages ? info.messages : info.toString()});
      }
      req.user = user;
      next();
    })(req, res, next);
  }
}
