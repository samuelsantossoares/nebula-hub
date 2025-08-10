const loginBtn = document.getElementById("loginBtn");
const userInfo = document.getElementById("userInfo");

window.onload = async () => {
  try {
    const res = await fetch("/api/auth");
    const data = await res.json();

    if (data.user) {
      loginBtn.classList.add("hidden");
      userInfo.classList.remove("hidden");
      userInfo.textContent = `Olá, ${data.user.username}`;
    }
  } catch (err) {
    console.error("Erro ao verificar login:", err);
  }
};

loginBtn.addEventListener("click", () => {
  window.location.href = "/api/auth";
});