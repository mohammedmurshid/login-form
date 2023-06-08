const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");

// Index Route
router.get("/", (req, res, next) => {
  if (!req.user) {
    return res.render("index.ejs");
  }
  next();
  res.render("home.ejs", { name: req.user.name });
});

// Login, Register and Logout Routes - START
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
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

module.exports = router;
