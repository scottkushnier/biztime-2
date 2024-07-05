/** BizTime express application. */

const express = require("express");

const app = express();
const ExpressError = require("./expressError");

const companyRoutes = require("./routes/companies");
const invoiceRoutes = require("./routes/invoices");

app.use("/companies", companyRoutes);

app.use("/invoices", invoiceRoutes);

module.exports = app;
