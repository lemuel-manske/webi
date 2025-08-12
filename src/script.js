const imgElement = document.getElementById('carousel-image');
const imageContainer = document.getElementById('image-container');
const bgElement = document.querySelector('.background');
const paginatorElement = document.getElementById('paginator');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const modalOverlay = document.getElementById('modal-overlay');
const addImageBtn = document.getElementById('add-image');
const editImageBtn = document.getElementById('edit-image');
const deleteImageBtn = document.getElementById('delete-image');
const cancelAddBtn = document.getElementById('cancel-add');
const confirmAddBtn = document.getElementById('confirm-add');
const imageUrlInput = document.getElementById('image-url-input');

function getStoredImages() {
  console.info('Retrieving images from `localStorage`.');

  const stored = localStorage.getItem('images');

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    console.error('Error trying to load images from `localStorage`.');
  }
}

function getApiImages() {
  console.info('Retrieving images from api.');

  const apiImages = fetch('https://jsonplaceholder.typicode.com/photos?_limit=50')
    .then(res => res.json())

  try {
    return apiImages;
  } catch {
    console.error('Error trying to load images from API.');
  }
}

getApiImages().then(apiImages => {
  runApplication([...getStoredImages(), ...apiImages]);
})

function runApplication(images) {

  let currentIndex = 0;

  let maxId = images.reduce((max, img) => Math.max(max, img.id), 0);

  function noImages() {
    return images.length === 0;
  }

  function justOneImage() {
    return images.length === 1;
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
    console.info("Displaying new image");

    if (images.length === 0) {
      return renderNoImages();
    }

    if (!document.getElementById('carousel-image')) {
      imageContainer.innerHTML = `<img id="carousel-image" src="" alt="Imagem do carrossel" />`;
    }

    const img = document.getElementById('carousel-image');
    img.style.opacity = 0;

    setTimeout(() => {
      const url = images[index].url;

      img.src = url;
      bgElement.style.backgroundImage = `url('${url}')`;
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

  function saveNewImage(id) {
    console.info('Saving new image.');

    const url = imageUrlInput.value.trim();

    if (!url) {
      return;
    }

    if (!id) {
      images.push({ id: ++maxId, url });
      persistImages(images);
      currentIndex = images.length - 1;
    } else {
      const image = images.find(img => img.id === id);

      if (image) {
        image.url = url;
        persistImages(images);
        updateImage(currentIndex);
      } else {
        console.error(`Image with id ${id} not found.`);
      }
    }

    updateImage(currentIndex);

    closeAddImageModal();
  }

  prevBtn.addEventListener('click', () => {
    if (noImages() || justOneImage()) {
      return;
    }

    console.info("Navigating to previous image");

    currentIndex = (currentIndex - 1 + images.length) % images.length;

    updateImage(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    if (noImages() || justOneImage()) {
      return;
    }

    console.info("Navigating to next image");

    currentIndex = (currentIndex + 1) % images.length;

    updateImage(currentIndex);
  });

  let isAdding = false;

  addImageBtn.addEventListener('click', () => {
    isAdding = true;

    openAddImageModal();
  });

  editImageBtn.addEventListener('click', () => {
    isAdding = false;

    openAddImageModal();
  });

  confirmAddBtn.addEventListener('click', () => {
    const currImageId = images[currentIndex].id

    saveNewImage(isAdding ? null : currImageId);
  });

  document.getElementById('delete-image').addEventListener('click', () => {
    if (images.length === 0) {
      updateImage(0);
      return;
    }

    console.info("Deleting image");

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

  // Starts carousel at first image
  updateImage(currentIndex);
}
