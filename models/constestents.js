const mongoose = require("mongoose");

const contestentData = mongoose.Schema(
  {
    user: { type: String, required: true },
    name : {
        type:String,
        required : true
    },
    sectionData: {
      type: String,
      required: true,
    },
    admNo:{
        type: Number,
        required: true
    },

    programData : [],

  },
  { timestamps: true }
);

module.exports = mongoose.model("contestentData", contestentData);
