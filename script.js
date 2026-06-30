/* ---------------- PASSWORD RULE ---------------- */
function validPassword(pwd) {
  return pwd.length === 8;
}

/* ---------------- SIGNUP ---------------- */
function signup() {
  let name = document.getElementById("firstname-input")?.value.trim();
  let email = document.getElementById("email-input")?.value.trim();
  let pwd = document.getElementById("password-input")?.value.trim();
  let cpwd = document.getElementById("confirm-password-input")?.value.trim();

  if (!name || !email || !pwd || !cpwd) {
    alert("All fields required");
    return;
  }

  if (!validPassword(pwd)) {
    alert("Password must be exactly 8 characters");
    return;
  }

  if (pwd !== cpwd) {
    alert("Passwords do not match");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.email === email)) {
    alert("Email already registered");
    return;
  }

  users.push({ name, email, pwd });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup Successful ✅");
  window.location.href = "login.html";
}

/* ---------------- SIGNIN ---------------- */
function signin() {
  let email = document.getElementById("emailinput")?.value.trim();
  let pwd = document.getElementById("passwordinput")?.value.trim();

  if (!email || !pwd) {
    alert("Enter email & password");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let found = users.find(u => u.email === email && u.pwd === pwd);

  if (found) {
    localStorage.setItem("loggedInUser", email);
    alert("Login Successful ✅");
    window.location.href = "studentlist.html";
  } else {
    alert("Gmail or Password does not match ❌");
  }
}

/* ---------------- LOGOUT ---------------- */
function logout() {
   if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("editIndex");
      window.location.href = "index.html";
}
}

/* ---------------- ADD STUDENT ---------------- */
function adddata() {
  let name = document.getElementById("Name")?.value.trim();
  let dept = document.getElementById("Department")?.value;
  let year = document.getElementById("Year")?.value;
  let photoInput = document.getElementById("Profile");

  let gender = document.querySelector('input[name="Gender"]:checked')?.value || "";
  let skills = [...document.querySelectorAll('input[name="Skill"]:checked')]
    .map(s => s.value)
    .join(",");

  if (!name || !dept || !year || !gender) {
    alert("Fill all details");
    return;
  }

  let students = JSON.parse(localStorage.getItem("students")) || [];

  /* ✅ IMAGE SELECTED */
  if (photoInput && photoInput.files.length > 0) {
    let reader = new FileReader();
// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
    reader.onload = function (e) {
      students.push({
        name,
        dept,
        year,
        gender,
        skills,
        photo: e.target.result   // ✅ Base64 image stored
      });

      localStorage.setItem("students", JSON.stringify(students));
      alert("Student Added ✅");
      clearForm();
    };

    reader.readAsDataURL(photoInput.files[0]);
  } 
  else {
    /* ✅ WITHOUT IMAGE */
    students.push({
      name,
      dept,
      year,
      gender,
      skills,
      photo: ""
    });

    localStorage.setItem("students", JSON.stringify(students));
    alert("Student Added ✅");
    clearForm();
  }
}

/* ---------------- CLEAR FORM ---------------- */
function clearForm() {
  if (!document.getElementById("Name")) return;

  document.getElementById("Name").value = "";
  document.getElementById("Department").value = "";
  document.getElementById("Year").value = "";

  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);

  if (document.getElementById("Profile")) {
    document.getElementById("Profile").value = "";
  }
}

/* ---------------- LOAD STUDENTS ---------------- */
function loadStudents() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  let tbody = document.querySelector("#studentTable tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  students.forEach((s, index) => {
    tbody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>
          <img src="${s.photo || 'https://via.placeholder.com/55'}">
        </td>
        <td>${s.name}</td>
        <td>${s.dept}</td>
        <td>${s.year}</td>
        <td>${s.gender}</td>
        <td>${s.skills}</td>
        <td>
          <button onclick="editStudent(${index})">Edit</button>
          <button onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* ---------------- DELETE ---------------- */
function deleteStudent(index) {
  let students = JSON.parse(localStorage.getItem("students")) || [];

  if (!confirm("Delete this student?")) return;

  students.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(students));

  loadStudents();
}

/* ---------------- EDIT ---------------- */
function editStudent(index) {
  localStorage.setItem("editIndex", index);
  window.location.href = "form.html";
}

/* ---------------- AUTO FILL FORM ---------------- */
function autoFillForm() {
  let index = localStorage.getItem("editIndex");
  if (index === null) return;

  let students = JSON.parse(localStorage.getItem("students")) || [];
  let s = students[index];

  if (!s) return;

  document.getElementById("Name").value = s.name;
  document.getElementById("Department").value = s.dept;
  document.getElementById("Year").value = s.year;

  document.querySelectorAll('input[name="Gender"]').forEach(r => {
    r.checked = (r.value === s.gender);
  });

  document.querySelectorAll('input[name="Skill"]').forEach(c => {
    c.checked = s.skills.includes(c.value);
  });

  let btn = document.querySelector(".button");
  if (btn) {
    btn.value = "Update Student";
    btn.setAttribute("onclick", "updateStudent()");
  }
}

/* ---------------- UPDATE ---------------- */
function updateStudent() {
  let index = localStorage.getItem("editIndex");
  if (index === null) return;

  let students = JSON.parse(localStorage.getItem("students")) || [];

  let name = document.getElementById("Name").value.trim();
  let dept = document.getElementById("Department").value;
  let year = document.getElementById("Year").value;
  let photoInput = document.getElementById("Profile");

  let gender = document.querySelector('input[name="Gender"]:checked')?.value || "";
  let skills = [...document.querySelectorAll('input[name="Skill"]:checked')]
    .map(s => s.value)
    .join(",");

  if (!name || !dept || !year || !gender) {
    alert("Fill all details");
    return;
  }

  /* ✅ If NEW IMAGE selected */
  if (photoInput && photoInput.files.length > 0) {
    let reader = new FileReader();

    reader.onload = function (e) {
      students[index] = {
        ...students[index],
        name,
        dept,
        year,
        gender,
        skills,
        photo: e.target.result   // ✅ NEW IMAGE
      };

      localStorage.setItem("students", JSON.stringify(students));
      localStorage.removeItem("editIndex");

      alert("Student Updated ✅");
      window.location.href = "studentlist.html";
    };

    reader.readAsDataURL(photoInput.files[0]);
  } 
  else {
    /* ✅ Keep OLD IMAGE */
    students[index] = {
      ...students[index],
      name,
      dept,
      year,
      gender,
      skills
    };

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.removeItem("editIndex");

    alert("Student Updated ✅");
    window.location.href = "studentlist.html";
  }
}

/* ---------------- SEARCH ---------------- */
function searchData() {
  let filter = document.getElementById("searchInput")?.value.toLowerCase();
  let rows = document.querySelectorAll("#studentTable tbody tr");

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(filter)
      ? ""
      : "none";
  });
}
/* ---------------- AUTO LOAD ---------------- */
window.onload = function () {
  loadStudents();
  autoFillForm();
};