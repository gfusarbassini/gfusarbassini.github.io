document.addEventListener('DOMContentLoaded', () => {
  // === HELPER: CHECK IF HOMEPAGE ===
  const isHomePage = () => {
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/index.html') || path.endsWith('/portfolio/') || path === '';
  };

  // === CYCLER (Smooth Opacity & Blur) ===
  const cycleItems = document.querySelectorAll('.cycle-item');
  if (cycleItems.length > 0) {
    let currentIndex = 0;
    cycleItems[0].classList.add('active');

    setInterval(() => {
      cycleItems[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % cycleItems.length;
      cycleItems[currentIndex].classList.add('active');
    }, 3000);
  }

  // === MENU GENERATION ===
  const menuContainer = document.getElementById('menu-container');
  if (menuContainer) {
    const path = window.location.pathname;
    const homeActive = isHomePage();

    // Calcola il prefisso per tornare alla root
    // Se siamo in una sottocartella (es. /works/progetto), serve "../../"
    const depth = (path.match(/\//g) || []).length;
    const isRepoFolder = path.includes('/portfolio/');
    const baseDepth = isRepoFolder ? 2 : 1;
    let prefix = '../'.repeat(Math.max(0, depth - baseDepth));

    const items = ["BIO", "WORKS", "MOGRAPH", "WEBSITES", "RENDERS", "PHOTOGRAPHY", "STORIES"];

    let menuHTML = `<div class="menu">`;
    items.forEach((item, index) => {
      // Link alla cartella (index) senza .html
      const link = `${prefix}${item.toLowerCase()}/`;
      menuHTML += `<a href="${link}" class="menu-item nav-item interactable">${item}</a>`;
      if (index < items.length - 1) menuHTML += `<br>`;
    });

    if (!homeActive) {
      const homeLink = prefix === '' ? './' : prefix;
      menuHTML += `<br>
        <a href="${homeLink}" class="menu-home nav-item interactable">
          <span class="home-arrow">
            <svg viewBox="0 0 24 24" fill="none"><path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
          <span>HOME</span>
        </a>
      `;
    }
    menuHTML += '</div>';
    menuContainer.innerHTML = menuHTML;
  }

  // === CUSTOM CURSOR ===
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.innerWidth > 768) {
    document.body.style.cursor = 'none';
    document.addEventListener('mousemove', (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
    });

    const refreshCursorListeners = () => {
      const interactables = document.querySelectorAll('.interactable, .menu-item, .menu-home, .modal-nav, #modalClose, a, button, .img-block img');
      interactables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-interact'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-interact'));
      });
    };
    refreshCursorListeners();
  }

  // === BURGER MENU ===
  const burger = document.getElementById('burger');
  const header = document.getElementById('main-header');
  let scrollPos = 0;

  if (burger && menuContainer) {
    const updateMenuPosition = () => {
      if (window.innerWidth <= 1024 && header) {
        const headerRect = header.getBoundingClientRect();
        menuContainer.style.top = `0px`;
        menuContainer.style.paddingTop = `${headerRect.bottom + 20}px`;
        menuContainer.style.height = `100vh`;
      }
    };

    burger.addEventListener('click', () => {
      const isOpen = menuContainer.classList.toggle('active');
      burger.classList.toggle('open');
      if (isOpen) {
        scrollPos = window.pageYOffset;
        updateMenuPosition();
        document.body.style.top = `-${scrollPos}px`;
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        window.scrollTo(0, scrollPos);
      }
    });
    window.addEventListener('resize', updateMenuPosition);
  }

  // === LIGHTBOX & KEYBOARD ===
  if (!isHomePage()) {
    const modal = document.getElementById('imageModal');
    if (modal) {
      const modalImg = document.getElementById('modalImg');
      const modalClose = document.getElementById('modalClose');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const projectImages = Array.from(document.querySelectorAll('.interactable img:not(.reel-cover), img.interactable:not(.reel-cover)'));
      let currentIndex = 0;

      const updateModalImage = (index) => {
        currentIndex = index;
        const img = projectImages[currentIndex];
        // Priority to data-src for high-resolution if it exists, otherwise use src
        modalImg.src = img.getAttribute('data-src') || img.src;
      };

      projectImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
          e.preventDefault();
          updateModalImage(index);
          modal.style.display = 'flex';
          document.body.classList.add('no-scroll');
          if (typeof refreshCursorListeners === 'function') refreshCursorListeners();
        });
      });

      const closeModal = () => {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
      };

      if (prevBtn) prevBtn.addEventListener('click', () => updateModalImage((currentIndex - 1 + projectImages.length) % projectImages.length));
      if (nextBtn) nextBtn.addEventListener('click', () => updateModalImage((currentIndex + 1) % projectImages.length));
      if (modalClose) modalClose.addEventListener('click', closeModal);

      document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
          if (e.key === 'ArrowLeft') updateModalImage((currentIndex - 1 + projectImages.length) % projectImages.length);
          else if (e.key === 'ArrowRight') updateModalImage((currentIndex + 1) % projectImages.length);
          else if (e.key === 'Escape') closeModal();
        }
      });
    }
  }

  // === SCROLL GALLERY ===
  window.sideScroll = (btn, dir) => {
    const row = btn.parentElement.querySelector('.gallery-row');
    if (row) row.scrollBy({ left: dir * (window.innerWidth * 0.5), behavior: 'smooth' });
  };

  // === GSAP ANIMATIONS ===
  gsap.from('.initial-hidden', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out"
  });

  // === REEL MODAL LOGIC ===
  const reelModal = document.getElementById('reelModal');
  if (reelModal) {
    const reelCards = Array.from(document.querySelectorAll('.reel-card'));
    const reelFrame = document.getElementById('reelFrame');
    const reelClose = document.getElementById('reelModalClose');
    const reelPrev = document.getElementById('reelPrevBtn');
    const reelNext = document.getElementById('reelNextBtn');
    let currentReelIndex = 0;

    const openReel = (index) => {
      currentReelIndex = index;
      const url = reelCards[currentReelIndex].getAttribute('data-reel-url');
      reelFrame.src = url;
      reelModal.style.display = 'flex';
      document.body.classList.add('no-scroll');

      // Force Instagram embed to re-process if needed
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    const closeReel = () => {
      reelModal.style.display = 'none';
      reelFrame.src = ''; // Stop video playback
      document.body.classList.remove('no-scroll');
    };

    reelCards.forEach((card, index) => {
      card.addEventListener('click', () => openReel(index));
    });

    if (reelClose) reelClose.addEventListener('click', closeReel);
    if (reelPrev) reelPrev.addEventListener('click', () => openReel((currentReelIndex - 1 + reelCards.length) % reelCards.length));
    if (reelNext) reelNext.addEventListener('click', () => openReel((currentReelIndex + 1) % reelCards.length));

    // Handle background click to close
    reelModal.addEventListener('click', (e) => {
      if (e.target === reelModal) closeReel();
    });

    // Mirror image keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (reelModal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') openReel((currentReelIndex - 1 + reelCards.length) % reelCards.length);
        else if (e.key === 'ArrowRight') openReel((currentReelIndex + 1) % reelCards.length);
        else if (e.key === 'Escape') closeReel();
      }
    });
  }
});