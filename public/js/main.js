const CACHE_KEY = "mostRecentRecord";
const DELAY_INTERVAL = 5000;

let mostRecentRecord = null;
let interval = null;

async function getFirstPage(data = {}) {
  const response = await fetch('/get-first-page', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

function getMostRecentRecord() {
  getFirstPage({
    maxRecords: 1,
    sort: [{field: "created", direction: "desc"}],
  }).then(response => {
    if (response.err) {
      console.error(response.err);
      return;
    }

    response.records.forEach((record) => {
      console.log(record.fields);
    });

    mostRecentRecord = response.records[0].fields;
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