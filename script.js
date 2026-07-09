// Initialize Lucide icons
lucide.createIcons();

// ==================== MOBILE MENU ====================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const menuContent = document.getElementById('menuContent');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');
const menuLinks = document.querySelectorAll('.menu-link');
const navLinks = document.querySelectorAll('.nav-link');

let isMenuOpen = false;

menuToggle.addEventListener('click', () => {
  isMenuOpen = !isMenuOpen;
  
  if (isMenuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    isMenuOpen = false;
    closeMenu();
  });
});

function openMenu() {
  mobileMenu.classList.remove('pointer-events-none', 'h-0', 'opacity-0');
  mobileMenu.classList.add('h-screen', 'opacity-100');
  
  menuContent.classList.remove('translate-y-8', 'opacity-0');
  menuContent.classList.add('translate-y-0', 'opacity-100');
  
  menuIcon.classList.add('rotate-90', 'scale-0', 'opacity-0');
  menuIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
  
  closeIcon.classList.remove('-rotate-90', 'scale-0', 'opacity-0');
  closeIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
  
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.add('pointer-events-none', 'h-0', 'opacity-0');
  mobileMenu.classList.remove('h-screen', 'opacity-100');
  
  menuContent.classList.add('translate-y-8', 'opacity-0');
  menuContent.classList.remove('translate-y-0', 'opacity-100');
  
  menuIcon.classList.remove('rotate-90', 'scale-0', 'opacity-0');
  menuIcon.classList.add('rotate-0', 'scale-100', 'opacity-100');
  
  closeIcon.classList.add('-rotate-90', 'scale-0', 'opacity-0');
  closeIcon.classList.remove('rotate-0', 'scale-100', 'opacity-100');
  
  document.body.style.overflow = '';
}

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ==================== SCROLL REVEAL ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
  observer.observe(el);
});

// ==================== ACTIVE NAV LINK ====================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('text-white');
    link.classList.add('text-white/80');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('text-white');
      link.classList.remove('text-white/80');
    }
  });
});

// ==================== STOP VIDEO AT SPECIFIC SECOND ====================
const heroVideo = document.querySelector('#hero video');

if (heroVideo) {
  heroVideo.removeAttribute('loop');
  
  heroVideo.addEventListener('timeupdate', () => {
    if (heroVideo.currentTime >= 4.75) {
      heroVideo.pause();
    }
  });
}

// ==================== COPY EMAIL ====================
const EMAIL_ADDRESS = 'evanchin75@gmail.com';

function copyEmailToClipboard(event) {
  event.preventDefault();
  
  navigator.clipboard.writeText(EMAIL_ADDRESS).then(() => {
    showToast('Email copied to clipboard! 📋');
  }).catch(() => {
    const tempInput = document.createElement('input');
    tempInput.value = EMAIL_ADDRESS;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Email copied to clipboard! 📋');
  });
}

function showToast(message) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

document.querySelectorAll('[data-copy-email]').forEach(element => {
  element.addEventListener('click', copyEmailToClipboard);
});


// ==================== LIGHTBOX / POSTER ZOOM ====================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const closeBtn = document.getElementById('lightboxClose');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomResetBtn = document.getElementById('zoomReset');

let currentZoom = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

// Open lightbox on poster click
document.querySelectorAll('.poster-item').forEach(item => {
  item.addEventListener('click', function() {
    const imageSrc = this.dataset.image;
    const title = this.dataset.title;
    openLightbox(imageSrc, title);
  });
});

function openLightbox(src, title) {
  lightboxImage.src = src;
  lightboxTitle.textContent = title || 'Poster';
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  resetZoom();
  
  // Re-initialize Lucide icons in lightbox
  setTimeout(() => lucide.createIcons(), 50);
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
  resetZoom();
}

// Close on background click
lightbox.addEventListener('click', function(e) {
  if (e.target === this) {
    closeLightbox();
  }
});

// Close with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && lightbox.style.display === 'flex') {
    closeLightbox();
  }
});

// Zoom functions
function resetZoom() {
  currentZoom = 1;
  translateX = 0;
  translateY = 0;
  updateImageTransform();
}

function updateImageTransform() {
  lightboxImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
}

zoomInBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  currentZoom = Math.min(currentZoom + 0.25, 5);
  updateImageTransform();
});

zoomOutBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  currentZoom = Math.max(currentZoom - 0.25, 0.5);
  updateImageTransform();
});

zoomResetBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  resetZoom();
});

// Mouse wheel zoom
lightboxImage.addEventListener('wheel', function(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.deltaY < 0) {
    currentZoom = Math.min(currentZoom + 0.25, 5);
  } else {
    currentZoom = Math.max(currentZoom - 0.25, 0.5);
  }
  updateImageTransform();
});

// Drag to pan when zoomed in
lightboxImage.addEventListener('mousedown', function(e) {
  if (currentZoom > 1) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    this.style.cursor = 'grabbing';
  }
});

document.addEventListener('mousemove', function(e) {
  if (isDragging && currentZoom > 1) {
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateImageTransform();
  }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  lightboxImage.style.cursor = currentZoom > 1 ? 'grab' : 'default';
});

// Touch support for mobile
let touchStartX, touchStartY, touchStartDist;

lightboxImage.addEventListener('touchstart', function(e) {
  if (e.touches.length === 1 && currentZoom > 1) {
    isDragging = true;
    touchStartX = e.touches[0].clientX - translateX;
    touchStartY = e.touches[0].clientY - translateY;
  }
}, { passive: true });

lightboxImage.addEventListener('touchmove', function(e) {
  if (isDragging && e.touches.length === 1 && currentZoom > 1) {
    translateX = e.touches[0].clientX - touchStartX;
    translateY = e.touches[0].clientY - touchStartY;
    updateImageTransform();
  }
}, { passive: true });

lightboxImage.addEventListener('touchend', function() {
  isDragging = false;
}, { passive: true });

// Close button
closeBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  closeLightbox();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (lightbox.style.display !== 'flex') return;
  if (e.key === '+' || e.key === '=') {
    currentZoom = Math.min(currentZoom + 0.25, 5);
    updateImageTransform();
  }
  if (e.key === '-') {
    currentZoom = Math.max(currentZoom - 0.25, 0.5);
    updateImageTransform();
  }
  if (e.key === '0') {
    resetZoom();
  }
});

// Certificate Modal Functions
function openModal(imageSrc) {
  const modal = document.getElementById('certModal');
  const modalImage = document.getElementById('modalImage');
  
  modalImage.src = imageSrc;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
  
  lucide.createIcons();
}

function closeModal() {
  const modal = document.getElementById('certModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});