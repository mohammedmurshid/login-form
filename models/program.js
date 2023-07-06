const mongoose = require("mongoose");


const programs = mongoose.Schema(
  {
    sectionData: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    stage: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("programs", programs);
