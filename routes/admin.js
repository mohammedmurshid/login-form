const express = require("express");
const router = express.Router();
const Program = require("../models/program");

// Index Route
router.get("/", (req, res) => {
  res.send("admin page");
  // res.render('admin.ejs')
});

router.get("/add-programs", (req, res) => {
  res.render("add-programs.ejs");
});
router.post("/add-programs", async (req, res) => {
  const newProgram = new Program({
    name: req.body.name,
    sectionData: req.body.sectionData,
    stage: req.body.stagedata,
    group: req.body.groupdata,
  });
  try {
    await newProgram.save();
    res.status(201).redirect("/admin");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
