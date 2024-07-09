/** BizTime express application. */

const express = require("express");

const app = express();

const companyRoutes = require("./routes/companies");
const invoiceRoutes = require("./routes/invoices");
const industryRoutes = require("./routes/industries");

app.use("/companies", companyRoutes);

app.use("/invoices", invoiceRoutes);

app.use("/industries", industryRoutes);

module.exports = app;
