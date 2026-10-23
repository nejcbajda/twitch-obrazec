const form = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
let useEmail = false;


const twitchSwal = Swal.mixin({
  background: "#18181b",
  color: "#efeff1",
  confirmButtonColor: "#9147ff",
  cancelButtonColor: "#53535f",
});

//Prikaz in brisanje napak
function showError(inputId, message) {
  const field = document.getElementById(inputId).closest(".field");
  field.classList.add("invalid");
  field.querySelector(".error").textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".field").forEach((field) => field.classList.remove("invalid"));
}


function readBirthDate() {
  const month = Number(document.getElementById("month").value);
  const day = Number(document.getElementById("day").value);
  const year = Number(document.getElementById("year").value);
  const date = new Date(year, month - 1, day);
  const isReal =
    month > 0 &&
    year >= 1900 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= new Date();
  return isReal ? date : null;
}

function getAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hadBirthday) age--;
  return age;
}


function validate() {
  clearErrors();
  let valid = true;

  if (!/^\w{4,25}$/.test(document.getElementById("username").value.trim())) {
    showError("username", "Uporabniško ime mora imeti od 4 do 25 znakov in lahko vsebuje samo črke (brez šumnikov), številke in podčrtaje.");
    valid = false;
  }

  if (document.getElementById("password").value.length < 8) {
    showError("password", "Geslo mora imeti vsaj 8 znakov.");
    valid = false;
  }

  if (!readBirthDate()) {
    showError("month", "Vnesi veljaven datum rojstva.");
    valid = false;
  }

  if (useEmail) {
    if (!/^[\w.+-]+@[\w-]+(\.[\w-]+)+$/.test(document.getElementById("email").value.trim())) {
      showError("email", "Vnesi veljaven e-poštni naslov.");
      valid = false;
    }
  } else if (!/^\d{6,12}$/.test(document.getElementById("phone").value.replace(/\s/g, ""))) {
    showError("phone", "Vnesi veljavno telefonsko številko.");
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validate()) {
    twitchSwal.fire({ icon: "error", title: "Napaka!", text: "Popravi označena polja in poskusi znova." });
    return;
  }

  if (getAge(readBirthDate()) < 13) {
    twitchSwal.fire({ icon: "warning", title: "Registracija še ni mogoča", text: "Za ustvarjanje računa na Twitchu moraš biti star vsaj 13 let." });
    return;
  }

  const username = document.getElementById("username").value.trim();
  const contact = useEmail ? document.getElementById("email").value.trim() : document.getElementById("country").value + " " + document.getElementById("phone").value.trim();

  const result = await twitchSwal.fire({
    icon: "question",
    title: "Ustvarim račun?",
    html: `Uporabniško ime: <b>${username}</b><br>${useEmail ? "E-pošta" : "Telefon"}: <b>${contact}</b>`,
    showCancelButton: true,
    confirmButtonText: "Da, registriraj me",
    cancelButtonText: "Nazaj",
  });

  if (result.isConfirmed) {
    await twitchSwal.fire({
      icon: "success",
      title: `Dobrodošli na Twitchu, ${username}!`,
      text: "Tvoj račun je ustvarjen.",
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    form.reset();
    setContactMode(false);
  }
});

//Preklop med telefonom in e-pošto
function setContactMode(email) {
  useEmail = email;
  document.getElementById("email-field").hidden = !email;
  document.getElementById("phone-field").hidden = email;
  clearErrors();
}

document.getElementById("use-email").addEventListener("click", () => setContactMode(true));
document.getElementById("use-phone").addEventListener("click", () => setContactMode(false));
//Prikaz in skrivanje gesla
document.querySelectorAll(".eye").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.classList.toggle("on", show);
    button.setAttribute("aria-label", show ? "Skrij geslo" : "Pokaži geslo");
  });
});

// 9. Pomoč pri vnosu
[form, loginForm].forEach((f) => {
  f.addEventListener("input", (event) => {
    event.target.closest(".field").classList.remove("invalid");
  });
});

["day", "year"].forEach((id) => {
  document.getElementById(id).addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/\D/g, "");
  });
});

document.getElementById("phone").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^\d ]/g, "");
});


function showInfo(event, title, text) {
  event.preventDefault();
  twitchSwal.fire({ icon: "info", title, text });
}

document.getElementById("terms-link").addEventListener("click", (event) => showInfo(event, "Pogoji uporabe", "To je šolski projekt. Pravi račun se ne ustvari in noben podatek se ne pošlje."));
document.getElementById("terms-link-login").addEventListener("click", (event) => showInfo(event, "Pogoji uporabe", "To je šolski projekt. Pravi račun se ne ustvari in noben podatek se ne pošlje."));
document.getElementById("privacy-link").addEventListener("click", (event) => showInfo(event, "Obvestilo o zasebnosti", "Vse, kar vpišeš, ostane v tvojem brskalniku. Stran nima strežnika."));

document.getElementById("forgot-password").addEventListener("click", () => {
  twitchSwal.fire({ icon: "info", title: "Pozabljeno geslo", text: "V tem šolskem projektu obnovitev gesla ni na voljo." });
});

//Preklop med prijavo in registracijo
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const title = document.getElementById("modal-title");

function showTab(login) {
  loginForm.hidden = !login;
  form.hidden = login;
  tabLogin.classList.toggle("active", login);
  tabSignup.classList.toggle("active", !login);
  tabLogin.toggleAttribute("aria-current", login);
  tabSignup.toggleAttribute("aria-current", !login);
  if (login) tabLogin.setAttribute("aria-current", "page");
  else tabSignup.setAttribute("aria-current", "page");
  title.textContent = login ? "Prijava v Twitch" : "Pridruži se Twitchu še danes";
  clearErrors();
}

tabLogin.addEventListener("click", (event) => { event.preventDefault(); showTab(true); });
tabSignup.addEventListener("click", (event) => { event.preventDefault(); showTab(false); });

//Preverjanje in oddaja prijave
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();
  let valid = true;

  const username = document.getElementById("login-username").value.trim();
  if (username.length < 4) {
    showError("login-username", "Vnesi uporabniško ime (vsaj 4 znake).");
    valid = false;
  }
  if (document.getElementById("login-password").value.length < 8) {
    showError("login-password", "Geslo mora imeti vsaj 8 znakov.");
    valid = false;
  }

  if (!valid) {
    twitchSwal.fire({ icon: "error", title: "Napaka!", text: "Popravi označena polja in poskusi znova." });
    return;
  }

  await twitchSwal.fire({
    icon: "success",
    title: `Pozdravljen, ${username}!`,
    text: "Prijava je uspela.",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
  loginForm.reset();
});


//Gumbi za prijavo prek Googla, Appla in Facebooka
document.querySelectorAll(".social-btn").forEach((button) => {
  button.addEventListener("click", () => {
    twitchSwal.fire({
      icon: "info",
      title: button.dataset.provider,
      text: `Prijava prek storitve ${button.dataset.provider} v tem šolskem projektu ni na voljo.`,
    });
  });
});
