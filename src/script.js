const API_URL = "https://jsonplaceholder.typicode.com/photos";

let photos = [];

let currPage = 1;
const maxPerPage = 10;

document.addEventListener("DOMContentLoaded", () => {
  loadPhotos();

  document
    .getElementById("formInserir")
    .addEventListener("submit", addPhoto);
});

function showSectionByName(name) {
  function hideAllSections() {
    document.querySelectorAll("main section")
      .forEach(s => s.classList.add("d-none"));
  }

  function showSection(name) {
    document.getElementById(`secao-${name}`)
      .classList
      .remove("d-none");
  }

  hideAllSections();
  showSection(name);
}

function hasElements(arr) {
  return arr && arr.length;
}

async function loadPhotos() {
  let localPhotos = JSON.parse(localStorage.getItem("fotos"));

  if (hasElements(localPhotos)) {
    photos = localPhotos;
  } else {
    const res = await fetch(API_URL + "?_limit=50");
    photos = await res.json();

    photos = photos.map(photo => ({
      ...photo,
      createdAt: new Date().toISOString()
    }));

    persistPhotos();
  }

  sortPhotosByDate();
  renderPhotos();
}

function sortPhotosByDate() {
  photos.sort((a, b) => {
    // Default to current date if createdAt doesn't exist
    const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
    const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
    return dateB - dateA; // Sort newest first
  });
}

function renderPhotos() {
  const photosToRender = getPhotosToRender();

  const tbody = document.getElementById("tabelaFotos");
  tbody.innerHTML = "";

  photosToRender.forEach(photo => {
    tbody.innerHTML += `
      <tr>
        <td>${photo.id}</td>
        <td>${photo.title}</td>
        <td><img src="${photo.url}" alt="${photo.title}"></td>
      </tr>
    `;
  });
}

function getPhotosToRender() {
  const start = (currPage - 1) * maxPerPage;
  const end = start + maxPerPage;

  return photos.slice(start, end);
}

function nextPage() {
  if (currPage * maxPerPage < photos.length) {
    currPage++;
    renderPhotos();
  }
}

function prevPage() {
  if (currPage > 1) {
    currPage--;
    renderPhotos();
  }
}

function addPhoto(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const url = document.getElementById("url").value;

  const newPhoto = {
    id: photos.length ? photos[photos.length - 1].id + 1 : 1,
    title,
    url,
    createdAt: new Date().toISOString()
  };

  photos.push(newPhoto);
  persistPhotos();
  sortPhotosByDate();
  renderPhotos();

  event.target.reset();

  alert("Foto adicionada com sucesso!");
}

function removePhoto() {
  const photoToRemoveId = parseInt(document.getElementById("idExcluir").value);

  const index = photos.findIndex(f => f.id === photoToRemoveId);
  if (index !== -1) {
    photos.splice(index, 1);
    persistPhotos();
    renderPhotos();

    alert("Foto removida!");
  } else {
    alert("Foto não encontrada!");
  }
}

function persistPhotos() {
  localStorage.setItem("fotos", JSON.stringify(photos));
}
