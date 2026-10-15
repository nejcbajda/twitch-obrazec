const form = document.getElementById("signup-form");
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
  form.querySelectorAll(".field").forEach((field) => field.classList.remove("invalid"));
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
document.getElementById("toggle-password").addEventListener("click", (event) => {
  const input = document.getElementById("password");
  const show = input.type === "password";
  input.type = show ? "text" : "password";
  event.currentTarget.classList.toggle("on", show);
  event.currentTarget.setAttribute("aria-label", show ? "Skrij geslo" : "Pokaži geslo");
});

// 9. Pomoč pri vnosu
form.addEventListener("input", (event) => {
  event.target.closest(".field").classList.remove("invalid");
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
document.getElementById("privacy-link").addEventListener("click", (event) => showInfo(event, "Obvestilo o zasebnosti", "Vse, kar vpišeš, ostane v tvojem brskalniku. Stran nima strežnika."));
document.getElementById("tab-login").addEventListener("click", (event) => showInfo(event, "Prijava", "Ta šolski projekt vsebuje samo obrazec za registracijo."));