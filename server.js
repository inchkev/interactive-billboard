require('dotenv').config()
const express = require('express');
const path = require('path');
const app = express();
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/public')));

app.post('/submit', (req, res) => {
  console.log(req.body);
  base('tblKl1yEoaQWmCXYJ').create(req.body,
    function(err, record) {
      res.send({err: err, record: record});
    }
  );
});

app.post('/get-first-page', (req, res) => {
  console.log(req.body);
  base('tblKl1yEoaQWmCXYJ').select(req.body).firstPage(
    function(err, records) {
      res.send({err: err, records: records});
    }
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
});

