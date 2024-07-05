const express = require("express");
const db = require("../db");

const router = new express.Router();

router.use(express.json());

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query("SELECT * FROM invoices");
    return res.json({ invoices: results.rows });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const results = await db.query("SELECT * FROM invoices WHERE id = $1", [
      id,
    ]);
    if (results.rows.length) {
      return res.json({ invoice: results.rows[0] });
    } else {
      return res.status(404).json("error");
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    data = req.body;
    // console.log(data);
    const results = await db.query(
      "INSERT INTO invoices (comp_code, amt, paid) VALUES ($1, $2, $3) RETURNING *;",
      [data.comp_code, data.amt, false]
    );
    // console.log(results);
    return res.json({ invoice: results.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const { amt } = req.body;
    console.log("amt", amt);
    const invoiceResult = await db.query(
      "SELECT * FROM invoices WHERE id = $1",
      [id]
    );
    if (!invoiceResult.rowCount) {
      return res.status(404).json("error");
    }
    const invoice = invoiceResult.rows[0];
    // console.log("invoice", invoice);
    if (invoice.amt != amt) {
      console.log("wrong amount: was expecting: ", invoice.amt, " got: ", amt);
      return res.json("wrong amount");
    }
    if (invoice.paid) {
      console.log("invoice was already paid");
      return res.json("already paid");
    }
    const result = await db.query(
      "UPDATE invoices SET paid = true, paid_date = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    // console.log("result:", result);
    if (result.rowCount) {
      return res.json({
        invoice: result.rows[0],
      });
    } else {
      return res.status(404).json("error");
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const results = await db.query("DELETE FROM invoices WHERE id = $1", [id]);
    if (results.rowCount) {
      return res.json({ status: "deleted" });
    } else {
      return res.status(404).json("error");
    }
  } catch (err) {
    next(err);
  }
});

/** 404 handler */

router.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

router.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message,
  });
});

module.exports = router;
