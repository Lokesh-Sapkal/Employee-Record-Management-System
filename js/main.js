const STORAGE_KEY = "employees_data";

let employees = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const ADMIN = {
    id: "admin",
    pass: "admin@123"
};

const role = document.getElementById('role');

const nav = document.getElementById('main-nav');
const dashboard = document.getElementById('nav1');
const database = document.getElementById('nav2');

const toggleBtn = document.getElementById('themeToggle');

const welcomeMsg = document.getElementById('welcome-msg');

const db = document.getElementById('dashboard');
const totalEmp = document.getElementById('emp');
const totalSalary = document.getElementById('total-salary');
const senior = document.getElementById('senior');
const junior = document.getElementById('junior');

const dbs = document.getElementById('database');
const add = document.getElementById('add');
const name = document.getElementById('name');
const age = document.getElementById('age');
const address = document.getElementById('address');
const salary = document.getElementById('salary');
const error = document.getElementById('error');
const sub = document.getElementById('submit');
const cls = document.getElementById('clear');
const tabRow = document.getElementById('table-row');
const records = document.getElementById('records');
const search = document.getElementById('search');
const searchInput = document.getElementById('searchInput');

const del = document.querySelectorAll(".del");
const update = document.querySelectorAll(".update");

const login = document.getElementById('login');
const loginId = document.getElementById('admin-id');
const loginPass = document.getElementById('admin-pass');
const submit = document.getElementById('sub');
const exit = document.getElementById('exit');

role.addEventListener('change', changeRole);

dashboard.addEventListener('click', navigateMenu);
database.addEventListener('click', navigateMenu);

toggleBtn.addEventListener('click', toggleTheme)

sub.addEventListener('click', addEmployee);
cls.addEventListener('click', clearAllData);
search.addEventListener('click', searchEmployee);

submit.addEventListener('click', handleAdminLogin);
exit.addEventListener('click', handleExit);

function changeRole() {
    if (role.value === "admin") {
        adminLogin();
        cls.style.display = 'grid';
        del.forEach(delBtn => delBtn.style.display = 'grid');
        update.forEach(upBtn => upBtn.style.display = 'grid');
        updateDashboard();

    }
    else {
        cls.style.display = 'none';
        del.forEach(delBtn => delBtn.style.display = 'none');
        update.forEach(upBtn => upBtn.style.display = 'none');
    }

    renderDatabase(employees);
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        toggleBtn.innerHTML = "Light Mode";
    }
    else {
        toggleBtn.innerHTML = "Dark Mode";
    }
}

function adminLogin() {
    welcomeMsg.style.display = 'none';
    dbs.style.display = 'none';
    db.style.display = 'none';
    nav.style.display = 'none';

    login.style.display = 'block';
}

function handleAdminLogin() {
    if ((loginId.value === '') || (loginPass.value === '')) {
        alert("Please enter your id and password.");
    }
    else if ((loginId.value === ADMIN.id) && (loginPass.value === ADMIN.pass)) {
        nav.style.display = 'flex';

        login.style.display = 'none';
        loginId.value = "";
        loginPass.value = "";

        db.style.display = 'block';
        renderDatabase(employees);
    }
    else {
        alert("Invalid id or password.");
    }
}

function handleExit() {
    role.value = "emp";

    login.style.display = 'none';
    loginId.value = "";
    loginPass.value = "";

    nav.style.display = 'flex';
    db.style.display = 'block';
    cls.style.display = 'none';

    renderDatabase(employees);
}

function navigateMenu(e) {
    welcomeMsg.style.display = 'none';

    if (e.target.value === "dashboard") {
        dbs.style.display = 'none';
        db.style.display = 'block';

        renderCharts();
    }
    else if (e.target.value === "database") {
        db.style.display = 'none';
        dbs.style.display = 'block';
    }
}

function renderDatabase(data) {
    records.innerHTML = "";

    if (data.length === 0) {
        records.innerHTML = "<p style='text-align:center;'>No Record found</p>";
        return;
    }

    records.innerHTML += `
        <div id="table-head">
            <li>ID</li>
            <li>Name</li>
            <li>Age</li>
            <li>Address</li>
            <li>Salary</li>
        </div>
    `;

    role.value === "admin" ? document.getElementById('table-head').style.width = '71.5%' : "";

    data.forEach((emp, index) => {
        const row = document.createElement("div");
        row.id = "table-row";

        row.innerHTML = `
            <li>${emp.id}</li>
            <li>${emp.name}</li>
            <li>${emp.age}</li>
            <li>${emp.address}</li>
            <li>${emp.salary}</li>
            ${role.value === "admin" ? `<button class="del" onclick = "deleteEmployee(${index})">Delete</button> <button class="update" onclick = "updateEmployee(${index})">Update</button>` : ""}
        `;

        records.appendChild(row);
    });
}

function addEmployee(e) {
    e.preventDefault();

    if (name.value === "" || age.value === "" || address.value === "" || salary.value === "") {
        error.innerText = "Please fill in all required fields.";
        setTimeout(() => { error.innerText = ""; }, 3000);
        return;
    }

    if (age.value < 18) {
        error.innerText = "Employee must be at least 18 years old.";
        setTimeout(() => { error.innerText = ""; }, 3000);
        return;
    }

    const newEmp = {
        id: employees.length ? employees[employees.length - 1].id + 1 : 1,
        name: name.value.toLowerCase(),
        age: Number(age.value),
        address: address.value,
        salary: Number(salary.value)
    };

    employees.push(newEmp);

    renderDatabase(employees);
    updateDashboard();
    saveRecords();
    clear();
}

function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

function clear() {
    name.value = "";
    age.value = "";
    address.value = "";
    salary.value = "";
}

function clearAllData(e) {

    if (confirm("Are you sure?")) {
        localStorage.removeItem(STORAGE_KEY);
        employees = [];
        renderDatabase(employees);
        updateDashboard();
    }
}

function deleteEmployee(index) {
    if (confirm("Are you sure?")) {
        employees.splice(index, 1);
        fixIndex();
        renderDatabase(employees);
        updateDashboard();
        saveRecords();
    }
}

function fixIndex() {
    let i = 0;
    for (i = 0; i < employees.length; i++) {
        employees[i].id = i + 1;
    }
}

function updateEmployee(index) {
    let employee = employees[index];

    deleteEmployee(index);

    if (employee === employees[index]) {
        return;
    }

    name.value = employee.name;
    age.value = employee.age;
    address.value = employee.address;
    salary.value = employee.salary;
}

function updateDashboard() {
    let tSal = 0;
    let maxAge = 0;
    let sEmp = "-";
    let minAge = 99;
    let jEmp = "-";

    employees.forEach(emp => {
        tSal += emp.salary;

        if (emp.age > maxAge) {
            maxAge = emp.age;
            sEmp = emp.name;
        }

        if (emp.age < minAge) {
            minAge = emp.age;
            jEmp = emp.name;
        }
    });

    totalEmp.innerText = employees.length;
    totalSalary.innerText = tSal;
    senior.innerText = sEmp;
    junior.innerText = jEmp;

    renderCharts();
}

function searchEmployee() {
    const val = searchInput.value;

    if (val.trim() === "") {
        renderDatabase(employees);
        return;
    }

    const filtered = employees.filter(emp => emp.name.toLowerCase() === val.toLowerCase());

    renderDatabase(filtered);
}

let lineChart, pieChart;

function renderCharts() {

    let names = employees.map(t => t.name);
    let ages = employees.map(t => t.age);
    let salaries = employees.map(t => t.salary);

    if (lineChart) lineChart.destroy();
    if (pieChart) pieChart.destroy();

    lineChart = new Chart(document.getElementById("lineChart"), {
        type: "line",
        data: {
            labels: names,
            datasets: [{
                label: "age",
                data: ages,
                borderWidth: 2,
                fill: false
            }]
        }
    });

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: names,
            datasets: [{
                label: "salary",
                data: salaries,
                borderWidth: 1
            }]
        }
    });
}

renderDatabase(employees);
updateDashboard();
renderCharts();