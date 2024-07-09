const express = require("express");
const db = require("../db");
const slugify = require("slugify");

const router = new express.Router();
const ExpressError = require("../expressError");

router.use(express.json());

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query("SELECT * FROM companies");
    return res.json({ companies: results.rows });
  } catch (err) {
    next(err);
  }
});

router.get("/:code", async function (req, res, next) {
  try {
    const code = req.params.code;
    // console.log("code:", code);
    const results = await db.query("SELECT * FROM companies WHERE code = $1", [
      code,
    ]);
    if (results.rows.length) {
      const invoices = await db.query(
        "SELECT * FROM invoices WHERE comp_code = $1",
        [code]
      );
      const industries = await db.query(
        `SELECT industries.name FROM companies JOIN companyIndustries ON companies.code = companyIndustries.company_code JOIN industries
 ON companyIndustries.industry_code = industries.code WHERE companies.code = $1`,
        [code]
      );
      return res.json({
        company: {
          ...results.rows[0],
          industries: industries.rows.map((x) => x.name),
          invoices: invoices.rows,
        },
      });
    } else {
      return res.status(404).json("error");
    }
    // return res.json("ok");
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    data = req.body;
    // console.log("data:", data);
    if (!data.code) {
      data.code = slugify(data.name);
    }
    const results = await db.query(
      "INSERT INTO companies (code, name, description) VALUES ($1, $2, $3);",
      [data.code, data.name, data.description]
    );
    return res.status(201).json({ company: data });
  } catch (err) {
    next(err);
  }
});

router.put("/:code", async function (req, res, next) {
  try {
    const code = req.params.code;
    data = req.body;
    const result = await db.query(
      "UPDATE companies SET name = $1, description = $2 WHERE code = $3;",
      [data.name, data.description, code]
    );
    if (result.rowCount) {
      return res.json({
        company: {
          code: code,
          name: data.name,
          description: data.description,
        },
      });
    } else {
      return res.status(404).json("error");
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:code", async function (req, res, next) {
  try {
    const code = req.params.code;
    const results = await db.query("DELETE FROM companies WHERE code = $1", [
      code,
    ]);
    if (results.rowCount) {
      return res.json({ status: "deleted" });
    } else {
      return res.status(404).json("error");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/:company/:industry", async function (req, res, next) {
  try {
    data = req.params;
    const results = await db.query(
      "INSERT INTO companyIndustries (company_code, industry_code) VALUES ($1, $2);",
      [data.company, data.industry]
    );
    return res.status(201).json({ companyIndustry: data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
