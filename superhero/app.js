const allTabsBody = document.querySelectorAll(".tab-body-single");
const allTabsHead = document.querySelectorAll(".tab-head-single");
const searchForm = document.querySelector(".app-header-search");
let searchList = document.getElementById("search-list");

let activeTab = 1,
  allData;

const init = () => {
  showActiveTabBody();
  showActiveTabHead();
};

const showActiveTabHead = () =>
  allTabsHead[activeTab - 1].classList.add("active-tab");

const showActiveTabBody = () => {
  hideAllTabBody();
  allTabsBody[activeTab - 1].classList.add("show-tab");
};

const hideAllTabBody = () =>
  allTabsBody.forEach((singleTabBody) =>
    singleTabBody.classList.remove("show-tab")
  );
const hideAllTabHead = () =>
  allTabsHead.forEach((singleTabHead) =>
    singleTabHead.classList.remove("active-tab")
  );

// even listeners for dom Content Loaded
window.addEventListener("DOMContentLoaded", () => init());
// button event listeners
allTabsHead.forEach((singleTabHead) => {
  singleTabHead.addEventListener("click", () => {
    hideAllTabHead();
    activeTab = singleTabHead.dataset.id;
    showActiveTabHead();
    showActiveTabBody();
  });
});

const getInputValue = (event) => {
  event.preventDefault();
  let searchText = searchForm.search.value;
  fetchAllSuperHero(searchText);
};

// search form submission
searchForm.addEventListener("submit", getInputValue);

// api key => 727054372039115
const fetchAllSuperHero = async (searchText) => {
  let url = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchText}&ts=1687953689613&apikey=0fc498898ce4f085cd1bbc38740813d9&hash=8939ec157872895103c67f577ab70f59`;
  try {
    const response = await fetch(url);
    allData = await response.json();
    console.log(allData);
    if (allData.status === "Ok") {
      showSearchList(allData.data.results);
    }
  } catch (error) {
    console.log(error);
  }
};
// appends all the data fetched into search list
const showSearchList = (data) => {
  searchList.innerHTML = "";
  data.forEach((dataItem) => {
    const divElem = document.createElement("div");
    divElem.classList.add("search-list-item");
    divElem.innerHTML = `
            <img src = "${
              dataItem.thumbnail.path + "." + dataItem.thumbnail.extension
            }" alt = "">
            <p data-id = "${dataItem.id}">${dataItem.name}</p>
        `;
    searchList.appendChild(divElem);
  });
};

// add event listener to search input to show suggestion
searchForm.search.addEventListener("keyup", () => {
  if (searchForm.search.value.length > 1) {
    fetchAllSuperHero(searchForm.search.value);
  } else {
    searchList.innerHTML = "";
  }
});

// when user clicks on suggestion
searchList.addEventListener("click", (event) => {
  let searchId = event.target.dataset.id;
  let singleData = allData.data.results.filter((singleData) => {
    return parseInt(searchId) === singleData.id;
  });
  showSuperheroDetails(singleData);
  searchList.innerHTML = "";
});

// shows the super hero details in the tab
const showSuperheroDetails = (data) => {
  let localHero = localStorage.getItem("favoriteArray");
  let heroInLocal = false;
  if (localHero) {
    heroInLocal = !!JSON.parse(localHero).find(
      (key) => parseInt(key) === data[0].id
    );
  }

  document.querySelector(".app-body-content-thumbnail").innerHTML = `
        <img src = "${
          data[0].thumbnail.path + "." + data[0].thumbnail.extension
        }">
    `;
  // for name
  document.querySelector(".name").innerHTML =
    data[0].name +
    `<span style="float:right;cursor:pointer;" onclick="favorite('${
      data[0].id
    }')"> <i class="fa-solid fa-heart" style="${
      heroInLocal ? "color:red;" : ""
    }"></i></span>`;
  // for description
  document.querySelector(".desc").textContent = data[0].description;

  let seriesHTML = (name) => `
    <li>
        <div>
            <i class="fa-solid fa-shield-halved"></i>
            <span>${name}</span>
        </div>
    </li>`;
  // for series
  document.querySelector(".series").innerHTML =
    data[0].series.items.length === 0 ? "<h4>Nothing here...</h4>" : "";
  data[0].series.items.forEach((item) => {
    document.querySelector(".series").innerHTML += seriesHTML(item.name);
  });

  let comicsHTML = (name) => `
    <li>
         <span>comic: </span>
         <span>${name}</span>
     </li>`;
  // for comics
  document.querySelector(".comics").innerHTML =
    data[0].comics.items.length === 0 ? "<h4>Nothing here...</h4>" : "";
  data[0].comics.items.forEach((item) => {
    document.querySelector(".comics").innerHTML += comicsHTML(item.name);
  });
  let storiesHTML = (name) => `
    <li>
         <span>
             <i class = "fas "></i> 
         </span>
         <span>${name}</span>
     </li>`;
  // for stories
  document.querySelector(".stories").innerHTML =
    data[0].stories.items.length === 0 ? "<h4>Nothing here...</h4>" : "";
  data[0].stories.items.forEach((item) => {
    document.querySelector(".stories").innerHTML += storiesHTML(item.name);
  });
  let eventsHTML = (name) => `
    <li>
         <span>${name}</span>
     </li>`;
  // for events
  document.querySelector(".events").innerHTML =
    data[0].events.items.length === 0 ? "<h4>Nothing here...</h4>" : "";
  data[0].events.items.forEach((item) => {
    document.querySelector(".events").innerHTML += eventsHTML(item.name);
  });
};
// add superhero to favorite list in local storage
function favorite(id) {
  let heroHeart = document.querySelector(".fa-solid.fa-heart");
  heroHeart.style.color = "red";

  let localItem = localStorage.getItem("favoriteArray");
  if (localItem === undefined || localItem === null) {
    localStorage.setItem("favoriteArray", `["${id}"]`);
  } else {
    console.log(localItem);
    let parseHeroList = JSON.parse(localItem);
    if (parseHeroList.find((key) => key === id)) {
      console.log("exists");
    } else {
    }
    localStorage.setItem(
      "favoriteArray",
      JSON.stringify([...parseHeroList, id])
    );
  }
}

document.getElementById("favorite").onclick = () => {
  window.location.href = "./favorite.html";
};
