document.addEventListener('DOMContentLoaded', () => {
  // pega tudo do dom logo
  const ticketForm = document.getElementById('ticket-form');
  const formSection = document.getElementById('form-section');
  const ticketSection = document.getElementById('ticket-section');
  const btnReset = document.getElementById('btn-reset');

  const avatarInput = document.getElementById('avatar-input');
  const dropzone = document.getElementById('dropzone');
  const dropzoneEmpty = document.getElementById('dropzone-empty');
  const dropzoneUploaded = document.getElementById('dropzone-uploaded');
  const avatarPreview = document.getElementById('avatar-preview');
  const btnRemoveAvatar = document.getElementById('btn-remove-avatar');
  const btnChangeAvatar = document.getElementById('btn-change-avatar');
  const avatarGroup = document.getElementById('avatar-group');
  const avatarHintText = document.getElementById('avatar-hint-text');

  const nameInput = document.getElementById('full-name');
  const nameGroup = document.getElementById('name-group');
  const nameHint = document.getElementById('name-hint');

  const emailInput = document.getElementById('email');
  const emailGroup = document.getElementById('email-group');
  const emailHint = document.getElementById('email-hint');

  const githubInput = document.getElementById('github-username');
  const githubGroup = document.getElementById('github-group');
  const githubHint = document.getElementById('github-hint');

  const ticketHeadingName = document.getElementById('ticket-heading-name');
  const ticketUserEmail = document.getElementById('ticket-user-email');
  const ticketAttendeeAvatar = document.getElementById('ticket-attendee-avatar');
  const ticketAttendeeName = document.getElementById('ticket-attendee-name');
  const ticketAttendeeGithub = document.getElementById('ticket-attendee-github');
  const ticketNumber = document.getElementById('ticket-number');

  let currentAvatarDataUrl = null;
  const DEFAULT_AVATAR_HINT = 'Upload your photo (JPG or PNG, max size: 500KB).';
  const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500kb max senao da ruim

  function setAvatarError(message) {
    avatarGroup.classList.add('has-error');
    avatarHintText.textContent = message;
    avatarInput.setAttribute('aria-invalid', 'true');
  }

  function clearAvatarError() {
    avatarGroup.classList.remove('has-error');
    avatarHintText.textContent = DEFAULT_AVATAR_HINT;
    avatarInput.removeAttribute('aria-invalid');
  }

  // le o arquivo e fé
  function handleFile(file) {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Invalid file format. Please upload a JPG or PNG image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setAvatarError('File too large. Please upload a photo under 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      currentAvatarDataUrl = e.target.result;
      avatarPreview.src = currentAvatarDataUrl;
      dropzoneEmpty.classList.add('hidden');
      dropzoneUploaded.classList.remove('hidden');
      clearAvatarError();
    };
    reader.readAsDataURL(file);
  }

  // gambiarra de click e drag drop
  dropzone.addEventListener('click', (e) => {
    if (e.target.closest('#btn-remove-avatar')) return;
    if (e.target.closest('#btn-change-avatar')) {
      avatarInput.click();
      return;
    }
    if (!currentAvatarDataUrl) {
      avatarInput.click();
    }
  });

  dropzone.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !currentAvatarDataUrl) {
      e.preventDefault();
      avatarInput.click();
    }
  });

  btnChangeAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    avatarInput.click();
  });

  btnRemoveAvatar.addEventListener('click', (e) => {
    e.stopPropagation();
    currentAvatarDataUrl = null;
    avatarInput.value = '';
    avatarPreview.src = '';
    dropzoneUploaded.classList.add('hidden');
    dropzoneEmpty.classList.remove('hidden');
    clearAvatarError();
    dropzone.focus();
  });

  avatarInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  function setFieldError(group, hintEl, message, input) {
    group.classList.add('has-error');
    hintEl.querySelector('.hint-text').textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(group, input) {
    group.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
  }

  // regex padrao q peguei no stackoverflow
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
      clearFieldError(nameGroup, nameInput);
    }
  });

  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value)) {
      clearFieldError(emailGroup, emailInput);
    }
  });

  githubInput.addEventListener('input', () => {
    if (githubInput.value.trim() !== '') {
      clearFieldError(githubGroup, githubInput);
    }
  });

  // submit
  ticketForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;
    let firstErrorField = null;

    if (!currentAvatarDataUrl) {
      setAvatarError('Please upload an avatar image.');
      hasError = true;
      if (!firstErrorField) firstErrorField = dropzone;
    }

    const nameVal = nameInput.value.trim();
    if (!nameVal) {
      setFieldError(nameGroup, nameHint, 'Please enter your full name.', nameInput);
      hasError = true;
      if (!firstErrorField) firstErrorField = nameInput;
    } else {
      clearFieldError(nameGroup, nameInput);
    }

    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      setFieldError(emailGroup, emailHint, 'Please enter an email address.', emailInput);
      hasError = true;
      if (!firstErrorField) firstErrorField = emailInput;
    } else if (!isValidEmail(emailVal)) {
      setFieldError(emailGroup, emailHint, 'Please enter a valid email address.', emailInput);
      hasError = true;
      if (!firstErrorField) firstErrorField = emailInput;
    } else {
      clearFieldError(emailGroup, emailInput);
    }

    let githubVal = githubInput.value.trim();
    if (!githubVal) {
      setFieldError(githubGroup, githubHint, 'Please enter your GitHub username.', githubInput);
      hasError = true;
      if (!firstErrorField) firstErrorField = githubInput;
    } else {
      clearFieldError(githubGroup, githubInput);
    }

    if (hasError) {
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    // bota o arroba se a pessoa esquecer
    if (!githubVal.startsWith('@')) {
      githubVal = '@' + githubVal;
    }

    // numero aleatorio qualquer
    const randomNum = String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0');
    const ticketCode = `#${randomNum}`;

    ticketHeadingName.textContent = nameVal;
    ticketUserEmail.textContent = emailVal;
    ticketAttendeeAvatar.src = currentAvatarDataUrl;
    ticketAttendeeAvatar.alt = `${nameVal}'s avatar`;
    ticketAttendeeName.textContent = nameVal;
    ticketAttendeeGithub.textContent = githubVal;
    ticketNumber.textContent = ticketCode;

    formSection.classList.add('hidden');
    ticketSection.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // limpa tudo e reseta
  btnReset.addEventListener('click', () => {
    ticketForm.reset();
    currentAvatarDataUrl = null;
    avatarInput.value = '';
    avatarPreview.src = '';
    dropzoneUploaded.classList.add('hidden');
    dropzoneEmpty.classList.remove('hidden');
    
    clearAvatarError();
    clearFieldError(nameGroup, nameInput);
    clearFieldError(emailGroup, emailInput);
    clearFieldError(githubGroup, githubInput);

    ticketSection.classList.add('hidden');
    formSection.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    nameInput.focus();
  });
});
