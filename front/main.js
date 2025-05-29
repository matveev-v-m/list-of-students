
const SERVER_URL = 'http://localhost:3000';

const tableWrap = document.querySelector(".table__wrap");
const newStudent = document.getElementById("new__student");
const findStudent = document.getElementById("find__student");
const inpSurname = document.getElementById("surname");
const inpName = document.getElementById("name");
const inpLastname = document.getElementById("lastname");
const inpDate = document.getElementById("date");
const inpStudyStart = document.getElementById("studyStart");
const inpFaculty = document.getElementById("faculty");
const allInp = document.querySelectorAll("input");
const form = document.getElementById("form");
const thead = document.querySelector(".table-dark");
const fullNameFilter = document.querySelector(".fullName-filter");
const facultyFilter = document.querySelector(".faculty-filter");
const dateFilter = document.querySelector(".date-filter");
const studyStartFilter = document.querySelector(".studyStart-filter");
let flag = true;
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
const year = date.getFullYear();

inpStudyStart.max = year;
inpDate.max = date.toISOString().slice(0, 10);

if (day < 10) {
  day = `0${day}`;
}
if (month < 10) {
  month = `0${month}`;
}

function zero(date) {
  if (date < 10) {
    date = `0${date}`;
  }
  return date;
}

// const studentsList = [
//   {
//     fullName: "БорисовБорисБорисович",
//     surname: "Борисов",
//     name: "Борис",
//     lastname: "Борисович",
//     faculty: "Архитектура",
//     studyStart: "2019-01-01",
//     birthday: new Date("1991-09-10"),
//   },
//   {
//     fullName: "АнтоновАнтонАнтонович",
//     surname: "Антонов",
//     name: "Антон",
//     lastname: "Антонович",
//     faculty: "Медицина",
//     studyStart: "2022-06-15",
//     birthday: new Date("1988-04-25"),
//   },
//   {
//     fullName: "ГригорьевГригорийГригорьевич",
//     surname: "Григорьев",
//     name: "Григорий",
//     lastname: "Григорьевич",
//     faculty: "Экономика",
//     studyStart: "2023-08-20",
//     birthday: new Date("1992-11-30"),
//   },
//   {
//     fullName: "ДенисовДенисДенисович",
//     surname: "Денисов",
//     name: "Денис",
//     lastname: "Денисович",
//     faculty: "Информатика",
//     studyStart: "2021-03-05",
//     birthday: new Date("1990-07-15"),
//   },
//   {
//     fullName: "ВикторовВикторВикторович",
//     surname: "Викторов",
//     name: "Виктор",
//     lastname: "Викторович",
//     faculty: "Химия",
//     studyStart: "2020-11-12",
//     birthday: new Date("1994-02-20"),
//   },
// ];

let studentsList = [];

async function serverAddStudent(obj) {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(obj),
  });

  let data = await response.json();

  return data
};

async function serverGetStudents() {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "GET",
    headers: {'Content-Type': 'application/json'},      
  });

  let data = await response.json();

  return data
};

let serverData = await serverGetStudents ();

if (serverData !== null){
  studentsList = serverData
}

async function serverDeleteStudent(id) {
  let response = await fetch(SERVER_URL + '/api/students/' + id, {
    method: "DELETE",
  });

  let data = await response.json();

  return data
};

function formateAge(dateValue) {
  const nDate = new Date(dateValue);
  const newYear = nDate.getFullYear();
  const newMonth = zero(nDate.getMonth() + 1);
  const newDay = zero(nDate.getDate());

  let years = year - newYear;
  if (newMonth > month) {
    years--;
  }

  let count = years;
  let result = "";

  if (count >= 10 && count <= 20) {
    result = " лет";
  } else {
    count = years % 10;
    if (count === 1) {
      result = " год";
    } else if (count >= 2 && count <= 4) {
      result = " года";
    } else {
      result = " лет";
    }
  }
  let yearsFormat = `${newDay}.${newMonth}.${newYear}`;
  return `${yearsFormat} (${years}${result})`;
}

function formateStudy(date) {
  const yearVal = new Date(date);  
  const course = year - yearVal.getFullYear();
  let studyVal = "";

  if (course > 4) {
    studyVal = `${yearVal.getFullYear()}-${yearVal.getFullYear() + 4} (Закончил(а))`;
  } else if (course <= 4) {
    studyVal = `${yearVal.getFullYear()}-${yearVal.getFullYear() + 4} (${course} курс)`;
  }
  return studyVal;
}

function getStudentItem(studentObj) {
  const rowTable = document.createElement("tr");
  const thFullName = document.createElement("th");
  const thFaculty = document.createElement("th");
  const thBirthday = document.createElement("th");
  const thStudyStart = document.createElement("th");
  const thDelete = document.createElement("th");
  const btnDelete = document.createElement("button");

  btnDelete.classList.add("btn", "btn-danger");
  btnDelete.textContent = "Удалить";

  btnDelete.addEventListener("click", async function(){
    await serverDeleteStudent(studentObj.id);
    rowTable.remove();
  });

  thFullName.textContent = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`;
  thFaculty.textContent = studentObj.faculty;
  thBirthday.textContent = formateAge(studentObj.birthday);
  thStudyStart.textContent = formateStudy(studentObj.studyStart);

  thDelete.append(btnDelete);
  tableWrap.append(rowTable);
  rowTable.append(thFullName, thFaculty, thBirthday, thStudyStart, thDelete);
}

function validation() {
  let i
  for (i = 0; i < allInp.length; i++) {
      allInp[i].classList.toggle("is-invalid", allInp[i].value === "");
  }
}

function filter(arr, prop, value) {
  let result = [];
  for (const item of arr) {
    if (String(item[prop]).includes(value) == true) result.push(item);
  }
  return result;
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (event.submitter == newStudent) {

    validation();

    const invalid = document.querySelectorAll(".is-invalid");

    if (invalid.length > 0) {
      alert("Заполните все поля!");
    } else {
      const newItem = {
        fullName: `${inpSurname.value}${inpName.value}${inpLastname.value}`,
        surname: inpSurname.value,
        name: inpName.value,
        lastname: inpLastname.value,
        faculty: inpFaculty.value,
        studyStart: inpStudyStart.value,
        birthday: inpDate.value,
      };

      let serverDataObj = await serverAddStudent(newItem);

      form.reset();
      tableWrap.innerHTML = "";
      studentsList.push(serverDataObj);
      studentsList.forEach((item) => getStudentItem(item));
    }
  }

  if (event.submitter == findStudent) {
    tableWrap.innerHTML = "";
    let newArr = [];

    if (inpSurname.value.trim() !== "") {
      newArr = filter(studentsList, "surname", inpSurname.value);
    }
    if (inpName.value.trim() !== "") {
      newArr = filter(studentsList, "name", inpName.value);
    }
    if (inpLastname.value.trim() !== "") {
      newArr = filter(studentsList, "lastname", inpLastname.value);
    }
    if (inpDate.value.trim() !== "") {
      newArr = filter(studentsList, "birthday", inpDate.value);
    }
    if (inpStudyStart.value.trim() !== "") {
      newArr = filter(studentsList, "studyStart", inpStudyStart.value);
    }
    if (inpFaculty.value.trim() !== "") {
      newArr = filter(studentsList, "faculty", inpFaculty.value);
    }

    for (let i = 0; i < newArr.length; i++) {
      getStudentItem(newArr[i]);
    }
    form.reset();
  }
});

function sortStudent(arr, prop, flag) {
  let result;
  if (flag === true) {
    result = arr.sort(function (a, b) {
      if (a[prop] < b[prop]) return -1;
    });
  } else {
    result = arr.sort(function (a, b) {
      if (a[prop] > b[prop]) return -1;
    });
  }

  return result;
}

thead.addEventListener("click", (event) => {
  let prop = "";

  if (event.target === fullNameFilter) {
    prop = "name";
  }
  if (event.target === facultyFilter) {
    prop = "faculty";
  }
  if (event.target === dateFilter) {
    prop = "birthday";
  }
  if (event.target === studyStartFilter) {
    prop = "studyStart";
  }

  flag = !flag;
  sortStudent(studentsList, prop, flag);
  tableWrap.innerHTML = "";
  studentsList.forEach((item) => getStudentItem(item));
});

  studentsList.forEach((item) => getStudentItem(item));


