let images = getImages();

let currentIndex = 0;

const imgElement = document.getElementById('carousel-image');
const imageContainer = document.getElementById('image-container');
const bgElement = document.querySelector('.background');
const paginatorElement = document.getElementById('paginator');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const modalOverlay = document.getElementById('modal-overlay');
const addImageBtn = document.getElementById('add-image');
const deleteImageBtn = document.getElementById('delete-image');
const cancelAddBtn = document.getElementById('cancel-add');
const confirmAddBtn = document.getElementById('confirm-add');
const imageUrlInput = document.getElementById('image-url-input');

function noImages() {
  return images.length === 0;
}

function getImages() {
  console.info('Retrieving images from `localStorage`.');

  const stored = localStorage.getItem('images');

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    console.error('Error trying to load images from localStorage.');
  }
}

function persistImages(images) {
  console.info('Saving images to `localStorage`.');

  localStorage.setItem('images', JSON.stringify(images));
}

function renderNoImages() {
  console.info('No images to render.');

  imageContainer.innerHTML = `<p class="empty-message">
      Nenhuma imagem disponível 
    </p>`;

  bgElement.style.backgroundImage = 'none';
  paginatorElement.textContent = '';
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  deleteImageBtn.disabled = true;
}

function updateImage(index) {
  if (images.length === 0) {
    return renderNoImages();
  }

  if (!document.getElementById('carousel-image')) {
    imageContainer.innerHTML = `<img id="carousel-image" src="" alt="Imagem do carrossel" />`;
  }

  const img = document.getElementById('carousel-image');
  img.style.opacity = 0;

  setTimeout(() => {
    img.src = images[index];
    bgElement.style.backgroundImage = `url('${images[index]}')`;
    paginatorElement.textContent = `Imagem ${index + 1} de ${images.length}`;
    img.style.opacity = 1;
  }, 300);

  prevBtn.disabled = false;
  nextBtn.disabled = false;
  deleteImageBtn.disabled = false;
}

function openAddImageModal() {
  imageUrlInput.value = '';
  modalOverlay.classList.add('active');
  imageUrlInput.focus();
}

function closeAddImageModal() {
  modalOverlay.classList.remove('active');
}

function saveNewImage() {
  const url = imageUrlInput.value.trim();

  if (!url) {
    return;
  }

  images.push(url);
  persistImages(images);
  currentIndex = images.length - 1;

  updateImage(currentIndex);

  closeAddImageModal();
}

prevBtn.addEventListener('click', () => {
  if (noImages()) {
    return;
  }

  currentIndex = (currentIndex - 1 + images.length) % images.length;

  updateImage(currentIndex);
});

nextBtn.addEventListener('click', () => {
  if (noImages()) {
    return;
  }

  currentIndex = (currentIndex + 1) % images.length;

  updateImage(currentIndex);
});

addImageBtn.addEventListener('click', () => {
  openAddImageModal();
});

confirmAddBtn.addEventListener('click', () => {
  saveNewImage();
});

document.getElementById('delete-image').addEventListener('click', () => {
  if (images.length === 0) {
    updateImage(0);
    return;
  }

  images.splice(currentIndex, 1);

  persistImages(images);

  if (currentIndex >= images.length) {
    currentIndex = 0;
  }

  updateImage(currentIndex);
});

window.onkeydown = (event) => {
  if (event.key !== 'Escape' || !modalOverlay.classList.contains('active')) {
    return;
  }

  closeAddImageModal();
};

updateImage(currentIndex);
