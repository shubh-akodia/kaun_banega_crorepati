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
    let h = t.getHours();

    document.getElementById("time").innerText = t.toLocaleTimeString();

    let msg = document.getElementById("greet_msg");
    let img = document.getElementById("greet_img");

    if (h < 12) {
      msg.innerText = "Good Morning";
      img.src = "images/gm.png";
    } 
    else if (h < 16) {
      msg.innerText = "Good Afternoon";
      img.src = "images/ga.png";
    } 
    else if (h < 19) {
      msg.innerText = "Good Evening";
      img.src = "images/ge.png";
    } 
    else {
      msg.innerText = "Good Night";
      img.src = "images/gn.png";
    }
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
function previewImage() {
  const fileInput = document.getElementById("image");
  const previewDiv = document.getElementById("img_prv");

  previewDiv.innerHTML = ""; // clear text

  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];

    // image validation (optional)
    if (!file.type.startsWith("image/")) {
      previewDiv.innerText = "Please select an image file ❌";
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.width = "150px";
      img.style.height = "150px";
      img.style.objectFit = "cover";
      img.style.border = "2px solid #333";
      img.style.borderRadius = "8px";

      previewDiv.appendChild(img);
    };

    reader.readAsDataURL(file);
  }
}

