const signinForm = document.getElementById("signin-form");
const signinEmail = document.getElementById("signin-email");
const signinPassword = document.getElementById("signin-password");
const signinMessage = document.getElementById("signin-message");

const storageKeys = {
  auth: "smartTransitAuth",
  user: "smartTransitUser"
};

function isStrongPassword(value) {
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  return value.length >= 8 && hasUpper && hasNumber;
}

function saveAuthState(email) {
  localStorage.setItem(storageKeys.auth, JSON.stringify({ signedIn: true, email }));
}

function readUser() {
  const raw = localStorage.getItem(storageKeys.user);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readAuth() {
  const raw = localStorage.getItem(storageKeys.auth);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const auth = readAuth();
if (auth?.signedIn) {
  signinMessage.textContent = "Session found. Please enter your password again to continue.";
}

if (signinForm) {
  signinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = signinEmail.value.trim();
    const password = signinPassword.value;

    if (!email) {
      signinMessage.textContent = "Please enter your email.";
      return;
    }

    if (!isStrongPassword(password)) {
      signinMessage.textContent = "Password must be at least 8 characters and include one uppercase letter and one number.";
      return;
    }

    const savedUser = readUser();
    if (!savedUser) {
      signinMessage.textContent = "No registered user found. Please register first.";
      return;
    }

    if (savedUser.email.toLowerCase() !== email.toLowerCase()) {
      signinMessage.textContent = "Email does not match a registered user. Please use Sign Up first.";
      return;
    }

    if (!savedUser.password) {
      signinMessage.textContent = "Account data is outdated. Please register again to continue.";
      return;
    }

    if (savedUser.password !== password) {
      signinMessage.textContent = "Incorrect password. Please enter the registered password.";
      return;
    }

    saveAuthState(email);
    signinMessage.textContent = "Sign in successful. Redirecting to dashboard...";

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 500);
  });
}
