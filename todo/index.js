// HTML for each Todo to custom append in container
const html = (name) =>
  `<div class="task"><input type="checkbox" id=${"todo" + name} /><label for=${
    "todo" + name
  }>${name}<span onclick="deleteTodo('${name}')">x</span></label></div>`;

//To add the todo
const addTodo = () => {
  let input = document.querySelector("input").value; // gets the value of input field
  document.querySelector(".todo").innerHTML += html(input, id); // appends the HTML of todo

  // Adds the same todo in the localstorage
  let localTodo = JSON.parse(localStorage.getItem("localTodo"));
  localStorage.setItem("localTodo", JSON.stringify([...localTodo, input]));
  document.querySelector("input").value = "";
  id++;
};
// To delete Todo based on the id of task
const deleteTodo = (id) => {
  let localTodo = JSON.parse(localStorage.getItem("localTodo")); // Gets the stored todo on local storage
  let newLocalTodo = localTodo.filter((todo) => todo !== id); // Filters the array for deleted todo

  //Refresh the todo list in LocalStorage and HTML
  localStorage.setItem("localTodo", JSON.stringify(newLocalTodo));
  document.querySelector(".todo").innerHTML = "";
  initializeLocalStorage();
};
// Function to initialize the local storage or to get the stored todo in the local storage
const initializeLocalStorage = () => {
  let localAlarmArray = localStorage.getItem("localTodo");
  if (localAlarmArray === null || localAlarmArray === undefined) {
    // Checks the localStorage to null or undefined
    localStorage.setItem("localTodo", `[]`); // if yes then creates the empty array as string in LocalStorage
  } else {
    // Else appends all the todo from localstorage to HTML
    let todos = JSON.parse(localAlarmArray);
    todos.forEach((todo) => {
      document.querySelector(".todo").innerHTML += html(todo);
    });
  }
};
// Function for greeting user based on time
const greet = () => {
  let date = new Date();
  let hour = date.getHours();
  let str = "";

  if (hour >= 6 && hour < 12) {
    str = "Good Morning";
  } else if (hour >= 12 && hour < 16) {
    str = "Good Afternoon";
  } else if (hour >= 16 && hour < 20) {
    str = "Good Evening";
  } else if (hour >= 20 && hour < 24) {
    str = "Good Night";
  }
  document.querySelector("#greet").innerText = str;
};
greet();
initializeLocalStorage();
