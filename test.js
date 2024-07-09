process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
const db = require("./db");

let gInvoiceID;

beforeEach(async function () {
  let resp = await db.query("DELETE FROM companies");
  resp = await db.query("DELETE FROM invoices");
  resp = await request(app).post("/companies").send({
    code: "IBM",
    name: "International Business Machines",
    description: "big blue",
  });
  resp = await request(app).post("/companies").send({
    code: "Giant",
    name: "Giant Food Company",
    description: "good food, great service",
  });
  resp = await request(app).post("/invoices").send({
    comp_code: "Giant",
    amt: 345.0,
  });
  gInvoiceID = resp.body.invoice.id;
});

afterAll(async function () {
  db.end();
});

describe("GET /companies", function () {
  test("Gets all companies", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.companies[0].code).toEqual("IBM");
  });
});

describe("GET /companies/:code", function () {
  test("Gets a company", async function () {
    const resp = await request(app).get("/companies/Giant");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.company.code).toEqual("Giant");
  });
});

describe("POST /companies", function () {
  test("Post a new company", async function () {
    const resp = await request(app).post("/companies").send({
      code: "COKE",
      name: "Coca Cola Company",
      description: "Coke is it.",
    });
    // console.log(resp.statusCode);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.company.code).toEqual("COKE");
    // console.log(resp.body);
  });
});

describe("PUT /companies", function () {
  test("Change a company", async function () {
    const resp = await request(app).put("/companies/Giant").send({
      code: "Giant",
      name: "Giant Food Company",
      description: "good food, great service, no bacon cheezits!",
    });
    // console.log(resp.statusCode);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.company.description).toEqual(
      "good food, great service, no bacon cheezits!"
    );
    // console.log(resp.body);
  });
});

describe("DELETE /companies/Giant", function () {
  test("Delete a company", async function () {
    const resp = await request(app).delete("/companies/Giant");
    // console.log(resp.statusCode);
    expect(resp.statusCode).toBe(200);
    // console.log(resp);
  });
});

describe("GET /invoices", function () {
  test("Get one invoices", async function () {
    const resp = await request(app).get("/invoices");
    expect(resp.statusCode).toBe(200);
    expect(resp.body.invoices[0].amt).toEqual(345);
  });
});

describe("GET an invoice", function () {
  test("Get a particular invoice", async function () {
    resp = await request(app).get(`/invoices/${gInvoiceID}`);
    expect(resp.statusCode).toBe(200);
  });
});

describe("PUT /invoice", function () {
  test("Pay an invoice", async function () {
    resp = await request(app).put(`/invoices/${gInvoiceID}`).send({
      amt: 345.0,
    });
    expect(resp.statusCode).toBe(200);
  });
});

describe("DELETE /invoice", function () {
  test("Delete an invoice", async function () {
    resp = await request(app).delete(`/invoices/${gInvoiceID}`);
    expect(resp.statusCode).toBe(200);
  });
});
