const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";
//const API = "https://randomuse.me/api/";
//const API = "https://us-central1-escuelajs-api.cloudfunctions.net/characters";
const $storage = window.localStorage;

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      let output = characters
        .map(character => {
          return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>`;
        })
        .join("");
      let newItem = document.createElement("section");
      newItem.classList.add("Items");
      newItem.innerHTML = output;
      $app.appendChild(newItem);
      if (response.info.next) {
        $storage.setItem("next_fetch", response.info.next);
      } else {
        fin = "<p><h1>Ya no hay personajes...</h1></p>";
        let endItem = document.createElement("section");
        endItem.classList.add("End");
        endItem.innerHTML = fin;
        $app.appendChild(endItem);
        intersectionObserver.unobserve($observe);
      }
    })
    .catch(error => console.log(error));
};

async function loadData() {
  if ($storage.length > 0) {
    await getData($storage.getItem("next_fetch"));
  } else {
    await getData(API);
  }
}

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

const deleteLocalStorage = () => {
  if ($storage.length > 0) {
    $storage.removeItem("next_fetch");
  }
};

deleteLocalStorage();
intersectionObserver.observe($observe);
