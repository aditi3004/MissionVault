const tabButtons = document.querySelectorAll(".tab-btn");
const tabSections = document.querySelectorAll(".tab-section");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-tab");

    tabSections.forEach((section) => {
      section.classList.add("hidden");
      if (section.getAttribute("data-tab") === target) {
        section.classList.remove("hidden");
        if (target === "view") fetchPersonnelRecords();
      }
    });
  });
});

async function fetchPersonnelRecords() {
  try {
    const res = await fetch("/api/records");
    const data = await res.json();

    const tbody = document.getElementById("personnel-body");
    tbody.innerHTML = "";

    data.forEach((person) => {
      const row = `
        <tr>
          <td class="p-2 border">${person.name}</td>
          <td class="p-2 border">${person.role}</td>
          <td class="p-2 border">${person.ranking}</td>
          <td class="p-2 border">${person.email}</td>
          <td class="p-2 border">${person.aadhaar_number}</td>
          <td class="p-2 border">${person.pan_number}</td>
          <td class="p-2 border">${person.dob}</td>
          <td class="p-2 border">${person.service_number}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error fetching records:", err);
  }
}

document
  .getElementById("add-record-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const newRecord = {
      name: document.getElementById("name").value,
      role: document.getElementById("role").value,
      ranking: document.getElementById("ranking").value,
      email: document.getElementById("email").value,
      aadhaar_number: document.getElementById("aadhaar_number").value,
      pan_number: document.getElementById("pan_number").value,
      dob: document.getElementById("dob").value,
      service_number: document.getElementById("service_number").value,
    };

    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Record Added! ID: ${data.id}`);
        fetchPersonnelRecords();
      } else {
        alert("Error adding record");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });

// 🚨 XSS Demo Handler
document.getElementById("xss-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = document.getElementById("xss-input").value;
  document.getElementById("xss-output").innerHTML = userInput;
});
