const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const dataSchema = mongoose.Schema(
  {
    data: {
      type: String,
    },
  },
  { timestamps: true }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      reqired: true,
    },
    email: {
      type: String,
      required: true,
    },
    data: {
      type: [dataSchema],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});
module.exports = mongoose.model("User", userSchema);
