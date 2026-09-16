const params = new URLSearchParams(document.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("auth", token);
}