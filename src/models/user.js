import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  email: String,
  social: {
    google: {
      id: String,
    },
  },
  hashedPassword: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  myList: [],
});

UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      id: this.id,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
  return token;
};

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

const User = mongoose.model('User', UserSchema);
export default User;
