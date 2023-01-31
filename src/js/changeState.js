(function () {
  const btnChangeState = document.querySelectorAll(".change-state");
  const token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  btnChangeState.forEach((btn) => {
    btn.addEventListener("click", changeStateProperty);
  });

  async function changeStateProperty(e) {
    const { propertyId: id } = e.target.dataset;
    console.log(id);

    try {
      const url = `/properties/${id}`;
      const resp = await fetch(url, {
        method: "PUT",
        headers: { "CSRF-TOKEN": token },
      });
      const { result } = await resp.json();

      if (result) {
        if (e.target.classList.contains("bg-green-200")) {
          e.target.textContent = "Not Public";
          e.target.classList.add("bg-red-200", "text-red-800");
          e.target.classList.remove("bg-green-200", "text-green-800");
        } else {
          e.target.textContent = "Public";
          e.target.classList.remove("bg-red-200", "text-red-800");
          e.target.classList.add("bg-green-200", "text-green-800");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
})();
