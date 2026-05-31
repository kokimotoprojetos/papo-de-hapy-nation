document.addEventListener('DOMContentLoaded', () => {
  // --- Accessibility Font Size Resizing ---
  const htmlElement = document.documentElement;
  let currentFontSize = 100; // in percent

  const decreaseBtn = document.getElementById('decreaseFontSize');
  const increaseBtn = document.getElementById('increaseFontSize');

  if (decreaseBtn && increaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      if (currentFontSize > 80) {
        currentFontSize -= 10;
        htmlElement.style.fontSize = `${currentFontSize}%`;
      }
    });

    increaseBtn.addEventListener('click', () => {
      if (currentFontSize < 130) {
        currentFontSize += 10;
        htmlElement.style.fontSize = `${currentFontSize}%`;
      }
    });
  }

  // --- Accordion details customization (Optional enhancements) ---
  const details = document.querySelectorAll('details.faq-item');
  
  details.forEach((targetDetail) => {
    targetDetail.addEventListener('click', (e) => {
      // Close other details to make it act as a true accordion
      if (targetDetail.hasAttribute('open')) return; // let normal closing happen
      
      details.forEach((detail) => {
        if (detail !== targetDetail && detail.hasAttribute('open')) {
          detail.removeAttribute('open');
        }
      });
    });
  });

  // --- Simulated Ticket Modal Handler ---
  const modal = document.getElementById('simulation-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalShowDate = document.getElementById('modal-show-date');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOkBtn = document.getElementById('btn-modal-ok');

  function openSimulation(dateString) {
    if (!modal) return;
    
    modalTitle.textContent = `Início da Venda Geral`;
    modalShowDate.innerHTML = `Setor Selecionado: <strong>Ingresso - Show de ${dateString}</strong>`;
    
    // Show Modal with animation class
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // lock scroll
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // unlock scroll
  }

  // Desktop buttons click
  const soldOutButtons = document.querySelectorAll('.tmpe-link-details');
  soldOutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const date = button.getAttribute('data-date');
      openSimulation(date);
    });
  });

  // Mobile list rows click
  const ticketLinks = document.querySelectorAll('.tmpe-ticket-link');
  ticketLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const date = link.getAttribute('data-date');
      openSimulation(date);
    });
  });

  // Close triggers
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeModal);

  // Close when clicking outside modal dialog
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
});
