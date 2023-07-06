const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");
const ContestentData = require("../models/constestents");
const Program = require('../models/program')
// Index Route
router.get("/", (req, res, next) => {
  res.render("index.ejs");
});

router.get("/home", async (req, res) => {
 

  if (!req.user.isAdmin === true) {
    res.render("home.ejs", { name: req.user.name });
  } else {
    res.redirect("/admin");
  }
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
  })
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
          res.redirect("/login");
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
router.get("/Add-contestent", (req, res) => {
  res.render("Add-contestent.ejs");
});

router.post("/Add-contestent", async (req, res) => {
  const newcontestentData = new ContestentData({
    user: req.user.name,
    name: req.body.name,
    sectionData: req.body.sectionData,
    admNo: req.body.admno,
  });
  try {
    await newcontestentData.save();
    res.status(201).redirect("/Add-contestent");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

  

const sectionArr = [];

router.get(
  "/regProgram",
  async (req, res) => {
    

    if (req.user) {
      const constestent = await ContestentData.find({
        user: `${req.user.name}`,
        sectionData: `${sectionArr[0]}`,
      });
       res.render("SELECTCOT.ejs", {
        constestent: constestent,
     });
    } else {
      res.redirect("/login");
    }
  },
  
);


router.post("/sectionSub", async (req, res) => {
 const section = req.body.sectionData
  if (section) {
    sectionArr.unshift(section);
    
    res.redirect("/regProgram");
  } else {
    res.send("Invalid request data");
  }
});

router.get('/:id', async (req, res) => {
  const constestent = await ContestentData.findById(req.params.id);
  const sd = constestent.sectionData;
  const programs = await Program.find({ sectionData: `${sd}` });

  res.render("ProgramReg.ejs", { constestent: constestent, programs : programs});
})


module.exports = router;
