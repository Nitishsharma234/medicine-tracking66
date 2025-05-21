// frontend/script.js
const form = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

const apiUrl = 'http://localhost:3000/students';

async function fetchStudents() {
  const res = await fetch(apiUrl);
  const students = await res.json();
  studentList.innerHTML = '';
  students.forEach(student => {
    studentList.innerHTML += `
      <tr>
        <td><input value="${student.name}" onchange="updateStudent(${student.id}, this.value, '${student.email}')"></td>
        <td><input value="${student.email}" onchange="updateStudent(${student.id}, '${student.name}', this.value)"></td>
        <td><button onclick="deleteStudent(${student.id})">Delete</button></td>
      </tr>
    `;
  });
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  form.reset();
  fetchStudents();
};

async function updateStudent(id, name, email) {
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  fetchStudents();
}

async function deleteStudent(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchStudents();
}

fetchStudents();
