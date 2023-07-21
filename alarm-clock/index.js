let clock = document.querySelector(".clk");
let inputHour = document.querySelector("#hrs");
let inputMinute = document.querySelector("#mns");
let inputSecond = document.querySelector("#secs");
let alarmLists = document.querySelector(".list");

setInterval(() => {
  let date = new Date(); // Create new instance of date
  clock.innerHTML = date.toLocaleTimeString(); //Appends the time of local into clock
  delete date; //Deletes the newly created date object to save memory
}, 1000); // updates every seconds

// HTML appending to Hours, Minutes, Seconds <select>'s <option>
function addHTML(to, i) {
  to.innerHTML += `<option value="${i}">${i}</option>`;
}
// loop for appending respective time in Hours, Minutes, Seconds
for (let i = 0; i <= 24; i++) addHTML(inputHour, i);
for (let i = 0; i <= 60; i++) addHTML(inputMinute, i);
for (let i = 0; i <= 60; i++) addHTML(inputSecond, i);

// Adds the alarm to the DOM and LocalStorage
function addAlarm() {
  let date = new Date();
  let id = date.getTime(); // Creates the new date object to get unique id for each alarm
  let hour = parseInt(inputHour.value); // Parses the string value of inputHour to integer value
  let minute = parseInt(inputMinute.value); // Parses the string value of inputMinute to integer value
  let second = parseInt(inputSecond.value); // Parses the string value of inputSeconds to integer value
  let ampm = hour > 12 ? " PM" : " AM"; //Sets the AM or PM according to hour selected
  hour = hour > 12 ? hour - 12 : hour;

  let html = `<div class="alarm" id="${id}">${hour}:${minute}:${second}${ampm} <i class="fa-solid fa-trash" data-att="d" onclick="deleteAlarm(this)"></i></div>`;
  alarmLists.innerHTML += html; // Appending the newly created alarm to the DOM

  let localAlarm = JSON.parse(localStorage.getItem("localAlarm"));
  localStorage.setItem(
    "localAlarm",
    JSON.stringify([...localAlarm, { hour, minute, second, ampm, id }]) // Storing the same alarm to the localStorage
  );
}
// takes the key(element) and removes from DOM and LocalStorage
function deleteAlarm(key) {
  let parent = key.parentElement; //Getting the parentElement
  let id = parseInt(parent.id); // Parent Element Id
  parent.remove(); // removes the parent(alarm) from the DOM
  let newLocal = [];

  let localAlarmArray = localStorage.getItem("localAlarm");

  localAlarmArray = JSON.parse(localStorage.getItem("localAlarm"));
  localAlarmArray.forEach((lp) => {
    if (lp.id !== id) newLocal.push(lp); // Pushes only those alarm whose id does not match with the id to be deleted
  });
  localStorage.setItem("localAlarm", JSON.stringify(newLocal)); // Updates the localstorage with new array
}

// Initialize LocalStorage to be not null
function initializeLocalStorage() {
  let localAlarmArray = localStorage.getItem("localAlarm");
  if (localAlarmArray === null || localAlarmArray === undefined) {
    // Checks the localStorage to null or undefined
    localStorage.setItem("localAlarm", `[]`); // if yes then creates the empty array as string in LocalStorage
  } else {
    // Otherwise takes the list and then adds Alarm in the DOM
    localAlarmArray = JSON.parse(localStorage.getItem("localAlarm"));
    localAlarmArray.forEach((lp) => {
      // Loops all over the array and creates the HTML to append
      let html = `<div class="alarm" id="${lp.id}">${lp.hour}:${lp.minute}:${lp.second}${lp.ampm} <i class="fa-solid fa-trash"  onclick="deleteAlarm(this)"></i></div>`;
      alarmLists.innerHTML += html;
    });
  }
}
initializeLocalStorage(); // calls the function for initialization
