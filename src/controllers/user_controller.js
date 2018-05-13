import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import UserModel from '../models/user_model';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide email, username, and password');
  }

  UserModel.findOne({ email }).then((result) => {
    if (result != null) {
      res.status(420).send('User already exists\n');
    } else {
      const newUser = new UserModel();
      newUser.email = email;
      newUser.password = password;
      newUser.username = username;
      newUser.save()
        .then((beep) => {
          res.send({ token: tokenForUser(beep) });
        })
        .catch((boop) => {
          res.status(500).json({ boop });
        });
    }
  });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
