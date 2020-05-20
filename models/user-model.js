const mongoose = require("mongoose");
const crypto = require("crypto");

const uuid = require('uuidv1');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    Hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: "subscriber",
    },
  },
  { timestamps: true }
);

UserSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuid() // uuid will generate the unique string, slat generate the hash of the unique key
    this.Hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

UserSchema.methods ={
    authenticate:function(plainText){
        return this.encryptPassword(plainText) === this.Hashed_password;
    },
    encryptPassword : function(password){
        if(!password) 
        return '';
        try{
            return crypto.createHmac('sha1',this.salt) // createHmac is a method to create hashed password
            .update(password)
            .digest('hex') 
        }catch(err){
            return err;
        }
    }
}

//module.exports = mongoose.model("User",UserSchema);
module.exports = User = mongoose.model('User', UserSchema)