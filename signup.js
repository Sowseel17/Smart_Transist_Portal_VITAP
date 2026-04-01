const signupForm = document.getElementById("signup-form");
const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupMessage = document.getElementById("signup-message");

function isStrongPassword(value) {
  const hasUpper = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  return value.length >= 8 && hasUpper && hasNumber;
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;

    if (name.length < 3) {
      signupMessage.textContent = "Name must be at least 3 characters.";
      return;
    }

    if (!email) {
      signupMessage.textContent = "Please enter your email.";
      return;
    }

    if (!isStrongPassword(password)) {
      signupMessage.textContent = "Password must be at least 8 characters and include one uppercase letter and one number.";
      return;
    }

    localStorage.setItem("smartTransitUser", JSON.stringify({ name, email, password }));
    signupMessage.textContent = "Sign up successful. Redirecting to Sign In...";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  });
}
