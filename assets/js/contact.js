document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");

    if (loading) loading.classList.add("d-block");
    if (errorMessage) errorMessage.classList.remove("d-block");
    if (sentMessage) sentMessage.classList.remove("d-block");

    const formData = new FormData(form);
    const action = form.getAttribute("action") || "forms/contact.php";

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      const text = await response.text();
      const message = text ? text.trim() : "";

      if (loading) loading.classList.remove("d-block");

      if (response.ok && message.toUpperCase() === "OK") {
        if (sentMessage) sentMessage.classList.add("d-block");
        form.reset();
      } else {
        throw new Error(message || "Your message could not be sent right now. Please email us directly at info.araag@gmail.com.");
      }
    } catch (error) {
      if (loading) loading.classList.remove("d-block");
      if (errorMessage) {
        errorMessage.innerHTML = error.message || "Your message could not be sent right now.";
        errorMessage.classList.add("d-block");
      }
    }
  });
});
