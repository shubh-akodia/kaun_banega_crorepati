let captchaText = "";
let captcha_check = false;
let password_check = false;
let number_check = false;
let email_check = false;

function init() {
  timer();
  generateCaptcha();
}

//  Time & Greeting
function timer() {
  setInterval(() => {
    let t = new Date();
    document.getElementById("time").innerText = t.toLocaleTimeString();
    let h = t.getHours();
    let msg = document.getElementById("greet_msg");
    msg.innerText =
      h < 12 ? "Good Morning" :
      h < 16 ? "Good Afternoon" :
      h < 19 ? "Good Evening" :
      "Good Night";
  }, 1000);
}

//  Captcha Generator
function generateCaptcha() {
  let c = document.getElementById("captcha");
  let ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  captchaText = "";
  for (let i = 0; i < 4; i++) {
    captchaText += chars[Math.floor(Math.random() * chars.length)];
  }

  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.font = "40px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText(captchaText, 40, 55);
}

//  Refresh Captcha
function refreshCaptcha() {
  generateCaptcha();
  document.getElementById("captcha_input").value = "";
  document.getElementById("result").innerText = "";
  captcha_check = false;
  enableSubmitCheck();
}

//  Captcha Validation
function checkCaptcha() {
  let val = document.getElementById("captcha_input").value;
  let msg = document.getElementById("result");

  if (val === captchaText) {
    msg.innerText = "Captcha ✅";
    msg.style.color = "green";
    captcha_check = true;
  } else {
    msg.innerText = "Captcha ❌";
    msg.style.color = "red";
    captcha_check = false;
  }
  enableSubmitCheck();
}

//  Password Check
function passcheck(v) {
  password_check = v.length >= 8;
  enableSubmitCheck();
}

//  Email
function name_email() {
  let e = email.value;
  email_check = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  enableSubmitCheck();
}
//  Number
function number() {
  number_check = /^\d{10}$/.test(num.value);
  enableSubmitCheck();
}

//  Basic Required Field Checks
function name_error() { enableSubmitCheck(); }
function date() { enableSubmitCheck(); }
function image_name() { enableSubmitCheck(); }
function address() { enableSubmitCheck(); }
function city_on() { enableSubmitCheck(); }

//  Enable Submit
function enableSubmitCheck() {
  let ok =
    uname.value &&
    email_check &&
    password_check &&
    dob.value &&
    number_check &&
    image.files.length &&
    add.value &&
    city.value &&
    captcha_check;

  document.getElementById("submit_btn").disabled = !ok;
}

//  Submit
function submitForm() {
  alert("Form Submitted Successfully ✅");
  return false;
}
