document.addEventListener('DOMContentLoaded', () => {
  // --- Accessibility Font Size Resizing (Shared) ---
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

  // --- Landing Page Specific Logic ---
  if (document.getElementById('Event')) {
    // Accordion FAQ Toggles
    const details = document.querySelectorAll('details.faq-item');
    details.forEach((targetDetail) => {
      targetDetail.addEventListener('click', () => {
        if (targetDetail.hasAttribute('open')) return;
        details.forEach((detail) => {
          if (detail !== targetDetail && detail.hasAttribute('open')) {
            detail.removeAttribute('open');
          }
        });
      });
    });
  }

  // --- Checkout Page Specific Logic ---
  if (document.getElementById('CheckoutPage')) {
    // Parse Query Parameters for selected date
    const urlParams = new URLSearchParams(window.location.search);
    let selectedDate = urlParams.get('date') || '28';
    
    // Validate date input
    if (selectedDate !== '28' && selectedDate !== '30' && selectedDate !== '31') {
      selectedDate = '28';
    }

    const summaryShowDateEl = document.getElementById('summary-show-date');
    if (summaryShowDateEl) {
      summaryShowDateEl.textContent = `Show de ${selectedDate} de Outubro de 2026`;
    }

    // Step Navigation elements
    const stepIndicators = {
      1: document.getElementById('step-indicator-1'),
      2: document.getElementById('step-indicator-2'),
      3: document.getElementById('step-indicator-3')
    };

    const sections = {
      1: document.getElementById('section-sectors'),
      2: document.getElementById('section-identity'),
      3: document.getElementById('section-payment')
    };

    let currentStep = 1;

    function goToStep(stepNumber) {
      // Deactivate current
      Object.keys(sections).forEach(key => {
        sections[key].classList.remove('active');
        stepIndicators[key].classList.remove('active');
      });

      // Activate new
      sections[stepNumber].classList.add('active');
      stepIndicators[stepNumber].classList.add('active');
      currentStep = stepNumber;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sector & Pricing details variables
    const sectorRadios = document.querySelectorAll('input[name="sector-selection"]');
    const qtyInput = document.getElementById('ticket-quantity');
    const qtyPlusBtn = document.getElementById('qty-plus');
    const qtyMinusBtn = document.getElementById('qty-minus');

    const summaryItemDesc = document.getElementById('summary-item-desc');
    const summaryItemPrice = document.getElementById('summary-item-price');
    const summaryFeePrice = document.getElementById('summary-fee-price');
    const summaryTotalPrice = document.getElementById('summary-total-price');

    let ticketPrice = 1250; // default for pista-inteira
    let quantity = 1;
    let sectorName = "Pista (Inteira)";

    function updatePricing() {
      // Determine selected sector info
      const checkedSector = document.querySelector('input[name="sector-selection"]:checked');
      if (checkedSector) {
        ticketPrice = parseFloat(checkedSector.getAttribute('data-price'));
        sectorName = checkedSector.parentElement.querySelector('.sector-name').textContent;
      }

      quantity = parseInt(qtyInput.value);

      // Calculations
      const subtotal = ticketPrice * quantity;
      const serviceFee = subtotal * 0.10; // 10% fee
      const total = subtotal + serviceFee;

      // Update summary text
      if (summaryItemDesc) summaryItemDesc.textContent = `${quantity}x ${sectorName}`;
      if (summaryItemPrice) summaryItemPrice.textContent = `R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (summaryFeePrice) summaryFeePrice.textContent = `R$ ${serviceFee.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      if (summaryTotalPrice) summaryTotalPrice.textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Attach pricing listeners
    sectorRadios.forEach(radio => {
      radio.addEventListener('change', updatePricing);
    });

    if (qtyPlusBtn && qtyMinusBtn && qtyInput) {
      qtyPlusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val < 5) {
          qtyInput.value = val + 1;
          updatePricing();
        }
      });

      qtyMinusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value);
        if (val > 1) {
          qtyInput.value = val - 1;
          updatePricing();
        }
      });
    }

    // Step 1 to 2 Navigation
    document.getElementById('btn-to-identity').addEventListener('click', () => {
      goToStep(2);
    });

    document.getElementById('btn-back-to-sectors').addEventListener('click', () => {
      goToStep(1);
    });

    // Step 2 to 3 Navigation & Validation
    const identityForm = document.getElementById('identity-form');
    document.getElementById('btn-to-payment').addEventListener('click', () => {
      const name = document.getElementById('buyer-name').value.trim();
      const cpf = document.getElementById('buyer-cpf').value.trim();
      const email = document.getElementById('buyer-email').value.trim();
      const phone = document.getElementById('buyer-phone').value.trim();

      if (!name || !cpf || !email || !phone) {
        alert('Por favor, preencha todos os dados de identificação.');
        return;
      }
      
      goToStep(3);
    });

    document.getElementById('btn-back-to-identity').addEventListener('click', () => {
      goToStep(2);
    });

    // Payment method tabs
    const tabPix = document.getElementById('tab-pix');
    const tabCard = document.getElementById('tab-card');
    const pixContent = document.getElementById('payment-pix-content');
    const cardContent = document.getElementById('payment-card-content');
    let paymentMethod = 'pix';

    if (tabPix && tabCard) {
      tabPix.addEventListener('click', () => {
        tabPix.classList.add('active');
        tabCard.classList.remove('active');
        pixContent.classList.add('active');
        cardContent.classList.remove('active');
        paymentMethod = 'pix';
      });

      tabCard.addEventListener('click', () => {
        tabCard.classList.add('active');
        tabPix.classList.remove('active');
        cardContent.classList.add('active');
        pixContent.classList.remove('active');
        paymentMethod = 'card';
      });
    }

    // CPF Masking
    const cpfInput = document.getElementById('buyer-cpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = value;
      });
    }

    // Phone Masking
    const phoneInput = document.getElementById('buyer-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/g, "$1-$2");
        e.target.value = value;
      });
    }

    // Credit Card Expiry Masking
    const expiryInput = document.getElementById('card-expiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(\d{2})(\d)/, "$1/$2");
        e.target.value = value;
      });
    }

    // Credit card formatting
    const ccInput = document.getElementById('card-number');
    if (ccInput) {
      ccInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(\d{4})(\d)/g, "$1 $2");
        e.target.value = value.trim();
      });
    }

    // Purchase validation and simulated completion
    let pollInterval = null;

    // Helper to show/hide loading overlay
    function showLoading(msg) {
      const overlay = document.getElementById('loading-overlay');
      const text = document.getElementById('loading-message');
      if (overlay && text) {
        text.textContent = msg || 'Processando...';
        overlay.style.display = 'flex';
      }
    }

    function hideLoading() {
      const overlay = document.getElementById('loading-overlay');
      if (overlay) {
        overlay.style.display = 'none';
      }
    }

    // Clipboard copy action
    const btnCopyPix = document.getElementById('btn-copy-pix');
    if (btnCopyPix) {
      btnCopyPix.addEventListener('click', () => {
        const input = document.getElementById('pix-copiapaste-code');
        if (input) {
          input.select();
          navigator.clipboard.writeText(input.value).then(() => {
            const successMsg = document.getElementById('copy-success-msg');
            if (successMsg) {
              successMsg.style.display = 'block';
              setTimeout(() => {
                successMsg.style.display = 'none';
              }, 3000);
            }
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        }
      });
    }

    // Helper to generate the success tickets screen
    function showSuccessTickets(name, cpf) {
      // Hide form & Pix container
      document.getElementById('checkout-form-section').style.display = 'none';
      document.getElementById('checkout-pix-section').style.display = 'none';
      const successSection = document.getElementById('checkout-success-section');
      successSection.style.display = 'block';

      // Generate Ticket HTML Elements
      const generatedTicketsContainer = document.getElementById('generated-tickets-container');
      generatedTicketsContainer.innerHTML = ''; // reset

      for (let i = 1; i <= quantity; i++) {
        const ticketCode = `TM-${selectedDate}10-${Math.floor(100000 + Math.random() * 900000)}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketCode)}`;
        const ticketCardHTML = `
          <div class="tm-ticket-card">
            <div class="ticket-main-info">
              <div class="ticket-brand">
                <img class="ticket-logo-tm" src="https://cdn.getcrowder.com/images/46b77c52-6acd-425b-985f-c036a9dcbf90-ticketmaster.svg?w=300" alt="Ticketmaster logo">
                <span class="ticket-type-label">${sectorName}</span>
              </div>
              <h3 class="ticket-event-name">BTS WORLD TOUR ARIRANG</h3>
              
              <div class="ticket-grid-details">
                <div class="ticket-field">
                  <span class="ticket-field-label">Data</span>
                  <span class="ticket-field-value">${selectedDate} de Outubro de 2026</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Local</span>
                  <span class="ticket-field-value">Estádio MorumBIS</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Nome do Titular</span>
                  <span class="ticket-field-value">${name}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">CPF</span>
                  <span class="ticket-field-value">${cpf}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Ingresso</span>
                  <span class="ticket-field-value">${i} de ${quantity}</span>
                </div>
                <div class="ticket-field">
                  <span class="ticket-field-label">Código</span>
                  <span class="ticket-field-value">${ticketCode}</span>
                </div>
              </div>
            </div>
            
            <div class="ticket-barcode-info">
              <div class="ticket-qrcode-wrapper">
                <img class="ticket-qr-sim" src="${qrCodeUrl}" alt="Código QR do Ingresso ${i}">
              </div>
              <span class="ticket-serial">${ticketCode.replace(/-/g, '')}</span>
            </div>
          </div>
        `;
        generatedTicketsContainer.insertAdjacentHTML('beforeend', ticketCardHTML);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Purchase validation and Invictus Pay integration
    document.getElementById('btn-submit-purchase').addEventListener('click', async () => {
      const name = document.getElementById('buyer-name').value.trim();
      const cpf = document.getElementById('buyer-cpf').value.trim();
      const email = document.getElementById('buyer-email').value.trim();
      const phone = document.getElementById('buyer-phone').value.trim();

      // Basic validations
      if (!name || !cpf || !email || !phone) {
        alert('Por favor, preencha todos os dados de identificação.');
        goToStep(2);
        return;
      }

      const cleanCpf = cpf.replace(/\D/g, '');
      const cleanPhone = phone.replace(/\D/g, '');

      if (cleanCpf.length !== 11) {
        alert('Por favor, digite um CPF válido.');
        goToStep(2);
        return;
      }

      const totalValue = (ticketPrice * quantity * 1.10); // Ticket price + 10% tax
      const amountCents = Math.round(totalValue * 100);

      const apiToken = '4puFJxwmWBVhKl4QcnBRnRob54YscEYFBeFSaCr0ljG4hVn1uaB2eXPsMWQY';
      const defaultOfferHash = 'sflcapne6m';
      const defaultProductHash = 'ebkyuskgpr';

      const customer = {
        name: name,
        email: email,
        phone_number: cleanPhone.substring(0, 15),
        document: cleanCpf
      };

      const cart = [{
        product_hash: defaultProductHash,
        title: `Ingresso BTS - ${sectorName}`,
        price: amountCents,
        quantity: 1,
        operation_type: 1,
        tangible: false
      }];

      if (paymentMethod === 'pix') {
        showLoading('Iniciando transação Pix com InvictusPay...');

        const payload = {
          amount: amountCents,
          offer_hash: defaultOfferHash,
          payment_method: 'pix',
          customer: customer,
          cart: cart
        };

        try {
          const response = await fetch(`https://api.invictuspay.app.br/api/public/v1/transactions?api_token=${apiToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const resData = await response.json();
          hideLoading();

          if (response.status === 201 && resData.pix && resData.pix.pix_qr_code) {
            const pixCode = resData.pix.pix_qr_code;
            const transactionHash = resData.hash;

            // Set inputs
            const pixCodeInput = document.getElementById('pix-copiapaste-code');
            if (pixCodeInput) pixCodeInput.value = pixCode;

            const pixQrCodeImg = document.getElementById('pix-qrcode-img');
            if (pixQrCodeImg) {
              pixQrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`;
            }

            // Show Pix Section
            document.getElementById('checkout-form-section').style.display = 'none';
            document.getElementById('checkout-pix-section').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Countdown Timer (15 minutes)
            let timeRemaining = 15 * 60;
            const countdownEl = document.getElementById('pix-countdown');
            const countdownInterval = setInterval(() => {
              timeRemaining--;
              const minutes = Math.floor(timeRemaining / 60);
              const seconds = timeRemaining % 60;
              if (countdownEl) {
                countdownEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
              }
              if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                clearInterval(pollInterval);
                alert('O código Pix expirou. Por favor, reinicie a compra.');
                location.reload();
              }
            }, 1000);

            // Poll Transaction Status
            pollInterval = setInterval(async () => {
              try {
                const pollRes = await fetch(`https://api.invictuspay.app.br/api/public/v1/transactions/${transactionHash}?api_token=${apiToken}`);
                if (pollRes.status === 200) {
                  const pollData = await pollRes.json();
                  const currentStatus = pollData.data ? (pollData.data.status || pollData.data.payment_status) : null;
                  if (currentStatus === 'paid' || currentStatus === 'success') {
                    clearInterval(pollInterval);
                    clearInterval(countdownInterval);
                    showSuccessTickets(name, cpf);
                  }
                }
              } catch (err) {
                console.error('Error polling transaction:', err);
              }
            }, 5000);

            // Manual Sim Confirmation Bypass Button
            const btnBypass = document.getElementById('btn-bypass-pix');
            if (btnBypass) {
              const newBypassBtn = btnBypass.cloneNode(true);
              btnBypass.replaceWith(newBypassBtn);
              newBypassBtn.addEventListener('click', () => {
                clearInterval(pollInterval);
                clearInterval(countdownInterval);
                showSuccessTickets(name, cpf);
              });
            }
          } else {
            alert(`Erro ao gerar Pix: ${resData.message || 'Verifique seus dados de CPF e telefone.'}`);
          }
        } catch (err) {
          hideLoading();
          console.error(err);
          alert('Erro de conexão com o servidor de pagamento. Tente novamente.');
        }

      } else {
        // Credit Card submit handler
        const ccNumber = document.getElementById('card-number').value.trim();
        const ccHolder = document.getElementById('card-holder').value.trim();
        const ccExpiry = document.getElementById('card-expiry').value.trim();
        const ccCvv = document.getElementById('card-cvv').value.trim();

        if (!ccNumber || !ccHolder || !ccExpiry || !ccCvv) {
          alert('Por favor, preencha todos os dados do Cartão de Crédito.');
          return;
        }

        showLoading('Processando transação com cartão no InvictusPay...');

        const expiryParts = ccExpiry.split('/');
        const expMonth = expiryParts[0] ? expiryParts[0].trim() : '';
        const expYear = expiryParts[1] ? '20' + expiryParts[1].trim() : '';

        const payload = {
          amount: amountCents,
          offer_hash: defaultOfferHash,
          payment_method: 'credit_card',
          customer: customer,
          cart: cart,
          card: {
            number: ccNumber.replace(/\s/g, ''),
            holder_name: ccHolder.toUpperCase(),
            exp_month: expMonth,
            exp_year: expYear,
            cvv: ccCvv
          }
        };

        try {
          const response = await fetch(`https://api.invictuspay.app.br/api/public/v1/transactions?api_token=${apiToken}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const resData = await response.json();
          hideLoading();

          // Standard check for successful transaction status
          const currentStatus = resData.payment_status || resData.status;
          if (response.status === 201 && (currentStatus === 'paid' || currentStatus === 'success')) {
            showSuccessTickets(name, cpf);
          } else {
            const errorMsg = resData.message || resData.status_reason || 'Transação recusada ou dados de cartão inválidos.';
            alert(`Erro no Cartão de Crédito: ${errorMsg}`);
          }
        } catch (err) {
          hideLoading();
          console.error(err);
          alert('Erro de conexão com o servidor de pagamento. Tente novamente.');
        }
      }
    });

    // Initialize pricing on page load
    updatePricing();
  }

  // --- Auth Modal Toggling & State Logic ---
  const authModal = document.getElementById('auth-modal');
  const loginNavBtn = document.getElementById('login_button');
  const closeAuthBtn = document.getElementById('close-auth-btn');
  
  const loginSection = document.getElementById('auth-login-section');
  const registerSection = document.getElementById('auth-register-section');
  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');

  const loginForm = document.getElementById('auth-login-form');
  const registerForm = document.getElementById('auth-register-form');

  function openAuthModal(defaultState = 'login') {
    if (!authModal) return;
    authModal.classList.add('show');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (defaultState === 'login') {
      loginSection.classList.add('active');
      registerSection.classList.remove('active');
    } else {
      registerSection.classList.add('active');
      loginSection.classList.remove('active');
    }
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove('show');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (loginNavBtn && loginNavBtn.classList.contains('btn-login-nav')) {
    loginNavBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginNavBtn.textContent.includes('Olá,')) {
        if (confirm('Deseja sair da sua conta?')) {
          loginNavBtn.textContent = 'Entrar / Cadastre-se';
        }
      } else {
        openAuthModal('login');
      }
    });
  }

  if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);

  if (linkToRegister) {
    linkToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      loginSection.classList.remove('active');
      registerSection.classList.add('active');
    });
  }

  if (linkToLogin) {
    linkToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      registerSection.classList.remove('active');
      loginSection.classList.add('active');
    });
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        closeAuthModal();
      }
    });
  }

  // Input formatting masks
  const regCpf = document.getElementById('reg-cpf');
  if (regCpf) {
    regCpf.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      e.target.value = value;
    });
  }

  const regBirth = document.getElementById('reg-birthdate');
  if (regBirth) {
    regBirth.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{2})(\d)/, "$1/$2");
      value = value.replace(/(\d{2})(\d)/, "$1/$2");
      e.target.value = value.substring(0, 10);
    });
  }

  const regPhone = document.getElementById('reg-phone');
  if (regPhone) {
    regPhone.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d)(\d{4})$/g, "$1-$2");
      e.target.value = value;
    });
  }

  // Submit Simulation handlers
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const userName = email.split('@')[0];
      
      if (loginNavBtn) {
        loginNavBtn.textContent = `Olá, ${userName.substring(0, 10)}!`;
      }
      closeAuthModal();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstname = document.getElementById('reg-firstname').value;
      
      if (loginNavBtn) {
        loginNavBtn.textContent = `Olá, ${firstname.substring(0, 10)}!`;
      }
      closeAuthModal();
      alert('Cadastro realizado com sucesso!');
    });
  }
});

