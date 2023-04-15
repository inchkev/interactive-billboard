const form = document.querySelector('form');
form.feeling.addEventListener("change", checkForm);
form.letGo.addEventListener("change", checkForm);
form.gain.addEventListener("change", checkForm);
form.keep.addEventListener("change", checkForm);
form.passThrough.addEventListener("change", checkForm);
form.afterwards.addEventListener("change", checkForm);

const loadTime = Date.now();

// const GATE_COLORS = ['#000000', '#dee335', '#98D185', '#EABD8B', '#F7DB50', '#93D4EB'];
const GATE_COLORS = ['#000000', '#c0ce1c', '#7ce359', '#ea8357', '#ffe047', '#5fc7ec'];

var q1info = {time: 0};
var q2info = {time: 0};
var q3info = {time: 0};
var q4info = {time: 0};
var q5info = {time: 0};
var q6info = {time: 0};

function startTimer(select, timer) {
  let startTime = 0;
  
  select.addEventListener('click', function() {
    startTime = new Date().getTime();
  });

  select.addEventListener('change', function() {
    if (startTime !== 0) {
      let endTime = new Date().getTime();
      timer.time += (endTime - startTime);
      startTime = 0;
      
      console.log('Time spent on ' + select.id + ': ' + timer.time + 'ms');
    }
  });
}

startTimer(form.feeling, q1info);
startTimer(form.letGo, q2info);
startTimer(form.gain, q3info);
startTimer(form.keep, q4info);
startTimer(form.passThrough, q5info);
startTimer(form.afterwards, q6info);


function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return {h, s, l};
}

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0, 
      b = 0; 

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

function jitterColor(color, amount) {
  // Convert hex color to hsl
  const hslColor = hexToHSL(color);

  // Add random jitter
  const jitteredHslColor = [
    hslColor.h + (Math.random() - 0.5) * amount / 2,
    hslColor.s + (Math.random() - 0.5) * amount,
    hslColor.l + (Math.random() - 0.5) * amount
  ];
  console.log(jitteredHslColor);

  // Convert back to hex
  return HSLToHex(...jitteredHslColor);
}


async function sendFormData(data = {}) {
  const response = await fetch('/submit', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const feelingIndex = form.feeling.selectedIndex;
  const letGoIndex = form.letGo.selectedIndex;
  const gainIndex = form.gain.selectedIndex;
  const keepIndex = form.keep.selectedIndex;
  const passThroughIndex = form.passThrough.selectedIndex;
  const afterwardsIndex = form.afterwards.selectedIndex;

  console.log(`Feeling: ${feelingIndex}`);
  console.log(`Let go: ${letGoIndex}`);
  console.log(`Gain: ${gainIndex}`);
  console.log(`Keep: ${keepIndex}`);
  console.log(`Pass through: ${passThroughIndex}`);
  console.log(`Afterwards: ${afterwardsIndex}`);


  var color = GATE_COLORS[passThroughIndex];
  if (passThroughIndex > 0) {
    color = jitterColor(color, 15);
  }
  console.log(`Color: ${color}`);

  const now = Date.now();
  const elapsed = (now - loadTime) / 1000;
  console.log(`Elapsed: ${elapsed}`);

  sendFormData({
    q1: feelingIndex,
    q2: letGoIndex,
    q3: gainIndex,
    q4: keepIndex,
    q5: passThroughIndex,
    q6: afterwardsIndex,
    color: color,
    totaltime: elapsed,
    q1time: q1info.time / 1000,
    q2time: q2info.time / 1000,
    q3time: q3info.time / 1000,
    q4time: q4info.time / 1000,
    q5time: q5info.time / 1000,
    q6time: q6info.time / 1000
  }).then(response => {
    if (response.err) {
      console.error(response.err);
      return;
    }
    // console.log(response.record.fields.id);
    console.log(`Created record with ID ${response.record.id}`);

    // $("#intro, form").hide();
    $(".number").text(response.record.fields.id);
    $("#intro, form").fadeOut("normal", function() {
      $("#confirm").fadeIn("fast");
    });
  });
});

function checkForm() {
  // check if all select elements have a non-default value
  if (
    form.feeling.value &&
    form.letGo.value &&
    form.gain.value &&
    form.keep.value &&
    form.passThrough.value &&
    form.afterwards.value
  ) {
    // enable the submit button
    form.submit.disabled = false;
  } else {
    // disable the submit button
    form.submit.disabled = true;
  }
}