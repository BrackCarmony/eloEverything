var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  display_name:{type:String, required:true, maxlength:40},
  email:{type:String, lowercase:true},
  password:String,
  facebookId:String,
  googleId:String,
  role:{type:String, default:"user"},
  pictureUrl:String,
  scores:[{
    _category:{type:ObjectId, ref:"Category"},
    score:{type:Number, default:1200},
    answered:{type:Number, default:0},
    correct:{type:Number, default:0},
    wrong:{type:Number, default:0},
    passed:{type:Number, default:0}
  }],
  questionsAsked:{type:Number, default:0},
  categoriesAsked:{type:Number, default:0},
  tagsAsked:{type:Number, default:0},
  timesQuestionsAsked:{type:Number, default:0},
  recent_questions:[{type:ObjectId, ref:"Question"}]
});

schema.pre('save', function(next){
  var user = this;
  if(!user.isModified('password')) return next();
  user.password = createHash(user.password);
  next();
})

schema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

function createHash(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = mongoose.model('User', schema);
