const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");

// Index Route
router.get("/", (req, res, next) => {
  // if (!req.user) {
  //   return res.render("index.ejs");
  // }
  // next();

  res.render("index.ejs");
});

router.get("/home", async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const data = user.data;
  res.render("home.ejs", { name: req.user.name, data: data });
});

// Login, Register and Logout Routes - START
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    keepSessionInfo: true,
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    if (req.user.isAdmin === true) {
      res.render("admin.ejs", { name: req.user.name });
    } else {
      res.render("home.ejs", { name: req.user.name });
    }
  }
);

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  User.register(
    {
      name: req.body.name,
      email: req.body.email,
    },
    req.body.password,
    async function (err, user) {
      if (err) {
        console.log(err);
        req.flash("message", "User Already registered");
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/");
        });
      }
    }
  );
});

router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
// Login, Register and Logout Routes - END

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
