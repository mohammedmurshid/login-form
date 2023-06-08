const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Create Post or Data Route - START
router.get("/createPost", (req, res) => {
  res.render("createPost.ejs");
});

router.post("/createPost", async (req, res) => {
  try {
    const userId = req.user._id; // takes the id of user who makes the request from passport
    const user = await User.findById(userId); // finds the user with that userId
    user.data.unshift({
      data: req.body.data, // takes the data from the form fields by their name
    });
    await user.save();
    res.status(201).json({ message: "post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// Create Post or Data Route - END

module.exports = router;
