const express = require("express");
const db = require("../db");

const router = new express.Router();
const ExpressError = require("../expressError");

router.use(express.json());

router.post("/", async function (req, res, next) {
  try {
    data = req.body;
    // console.log("data: ", data);
    const results = await db.query(
      "INSERT INTO industries (code, name) VALUES ($1, $2);",
      [data.code, data.name]
    );
    return res.status(201).json({ industry: data });
  } catch (err) {
    next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query("SELECT * FROM industries;");
    const industries = results.rows;
    for (let industry of industries) {
      // console.log("industry:", industry);
      const companies = await db.query(
        "SELECT * FROM companies JOIN companyIndustries ON companies.code = companyIndustries.company_code WHERE companyIndustries.industry_code = $1",
        [industry.code]
      );
      industry.companiesList = companies.rows.map((x) => x.code);
      // console.log(companies.rows);
    }
    return res.status(201).json({ industries: industries });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
