\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS companyIndustries;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
  code text PRIMARY KEY,
  name text
);

CREATE TABLE companyIndustries (
  id serial PRIMARY KEY,
  company_code text,
  industry_code text
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.'),
         ('StateFarm', 'State Farm Insurance', 'my car insurance company'),
         ('VZ', 'Verizon', 'FIOS maker');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, name) 
  VALUES ('tech', 'Tech Industry'),
         ('fin', 'Finance'),
         ('retail', 'Retail Sales'),
         ('ins', 'Insurance'),
         ('telecom', 'Telecommunications');

INSERT INTO companyIndustries (company_code, industry_code) 
  VALUES ('apple', 'tech'),
         ('VZ', 'tech'),
         ('VZ', 'telecom'),
         ('StateFarm', 'ins'),
         ('ibm', 'tech');