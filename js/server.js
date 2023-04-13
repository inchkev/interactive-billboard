require('dotenv').config()
const express = require('express');
const app = express();
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.post('/submit', (req, res) => {
  console.log(req.body);
  base('tblKl1yEoaQWmCXYJ').create(req.body,
  function(err, record) {
    // if (err) {
    //   console.error(err);
    //   res.status(500).send('Error occurred while sending data to Airtable.');
    // } else {
      // console.log(records);
      res.send({err: err, record: record});
    // }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
});

