const CACHE_KEY = "mostRecentRecord";
const DELAY_INTERVAL = 5000;

const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);
const tableId = 'tblKl1yEoaQWmCXYJ';

let mostRecentRecord = null;
let interval = null;

function getMostRecentRecord() {
  base(tableId).select({
    maxRecords: 1,
    sort: [{field: "created", direction: "desc"}],
  }).firstPage((err, records) => {
    if (err) { console.error(err); return; }

    records.forEach((record) => {
      console.log(record.fields);
    });

    mostRecentRecord = records[0].fields;
    const recordCreated = new Date(mostRecentRecord.created).getTime();
    const now = Date.now();
    const wait = DELAY_INTERVAL - (now - recordCreated);

    if (wait <= 0) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(mostRecentRecord));
      displayGate(mostRecentRecord);
    } else {
      clearInterval(interval);
      setTimeout( function() {
        localStorage.setItem(CACHE_KEY, JSON.stringify(mostRecentRecord));
        displayGate(mostRecentRecord);
        interval = setInterval(getMostRecentRecord, DELAY_INTERVAL);
      }, wait);
    }
  });
}

function displayGate(record) {
  const q1 = record.q1;
  const q2 = record.q2;
  const q3 = record.q3;
  const q4 = record.q4;
  const q5 = record.q5;
  const q6 = record.q6;
  const color = record.color;

  console.log(`q1: ${q1}`);
  console.log(`q2: ${q2}`);
  console.log(`q3: ${q3}`);
  console.log(`q4: ${q4}`);
  console.log(`q5: ${q5}`);
  console.log(`q6: ${q6}`);

  const gateDiv = document.getElementById('gate');
  gateDiv.style.backgroundColor = color;
}


let cachedRecord = JSON.parse(localStorage.getItem(CACHE_KEY));
if (cachedRecord) {
  console.log(cachedRecord);
  displayGate(cachedRecord);
}

setTimeout(function() {
  getMostRecentRecord();
  interval = setInterval(getMostRecentRecord, DELAY_INTERVAL);
}, DELAY_INTERVAL);