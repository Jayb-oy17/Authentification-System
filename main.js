const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const switchMode = document.getElementById("switchMode");
const message = document.getElementById("message");
const togglePass = document.getElementById("togglePass");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const emailInput = document.getElementById("email");
const rememberMe = document.getElementById("rememberMe");
const authBox = document.getElementById("authBox");
const dashboard = document.getElementById("dashboard");
const userEmail = document.getElementById("userEmail");

let isLogin = false;

const remembered = localStorage.getItem("session");
if (remembered) showDashboard(remembered);

switchMode.onclick = () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  submitBtn.textContent = isLogin ? "Login" : "Sign Up";
  switchMode.textContent = isLogin
    ? "Don't have an account? Sign Up"
    : "Already have an account? Login";
  message.textContent = "";
  confirmInput.style.display = isLogin ? "none" : "block";
};

togglePass.onclick = (e) => {
  e.preventDefault();
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  togglePass.textContent = passwordInput.type === "password" ? "Show" : "Hide";
};

submitBtn.onclick = () => {
  const email = emailInput.value.trim().toLowerCase();
  const pass = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();
  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (!email || !pass || (!isLogin && !confirm))
    return setMsg("Fill in all fields.", "error");
  if (!validateEmail(email)) return setMsg("Invalid email format.", "error");
  if (pass.length < 6)
    return setMsg("Password must be at least 6 characters.", "error");

  if (isLogin) {
    const found = users.find((u) => u.email === email && u.password === pass);
    if (found) {
      if (rememberMe.checked) localStorage.setItem("session", email);
      showDashboard(email);
    } else {
      setMsg("Invalid credentials.", "error");
    }
  } else {
    if (pass !== confirm) return setMsg("Passwords do not match.", "error");
    if (users.some((u) => u.email === email))
      return setMsg("Email already exists.", "error");
    users.push({ email, password: pass });
    localStorage.setItem("users", JSON.stringify(users));
    setMsg("Signup successful! You can now login.", "success");
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem("session");
  authBox.style.display = "block";
  dashboard.style.display = "none";
  emailInput.value = "";
  passwordInput.value = "";
  confirmInput.value = "";
  rememberMe.checked = false;
};

function showDashboard(email) {
  authBox.style.display = "none";
  dashboard.style.display = "block";
  userEmail.textContent = email;
}

function setMsg(text, type) {
  message.textContent = text;
  message.className = type;
}

function validateEmail(mail) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail);
}
