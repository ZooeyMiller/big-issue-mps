const container = document.getElementById('activist-army-container');
const userDataForm = document.getElementById('activist-user-info');
const emailTemplate = document.getElementById('email-template');
let state = {
  userInfo: {},
  mp: null,
  id: null,
  recaptcha: null,
};

function setState(stateProps) {
  Object.keys(stateProps).forEach(function(propName) {
    state[propName] = stateProps[propName];
  });

  return state;
}

userDataForm.addEventListener('submit', function(event) {
  event.preventDefault();
  state.userInfo.name = event.target[0].value;
  state.userInfo.email = event.target[1].value;
  state.userInfo.postcode = event.target[2].value;
  if (state.recaptcha) {
    sendCandidateData(state.userInfo, state.recaptcha);
  } else {
    showError(new Error('reCAPTCHA error'));
  }
});

function sendCandidateData({ name, email, postcode }, recaptcha) {
  showLoader();
  fetch('/api/get-candidate', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      postcode,
      recaptcha,
    }),
  })
    .then(function(res) {
      if (res.status !== 200) {
        throw new Error('Invalid postcode');
      }
      return res.json();
    })
    .then(res => {
      if (res.error === 'recaptcha failed') {
        throw new Error('Invalid reCAPTCHA');
      }
      hideLoader();
      return res;
    })
    .then(res => setState({ mp: res.mp, id: res.id }))
    .then(makeForm)
    .then(() => {
      createTemplateCopy();
      createCard(state.mp);
      window.location.href = '#activist-army-start';
    })
    .catch(res => {
      hideLoader();
      showError(res);
    });
  userDataForm.style.display = 'none';
}

function create(tag, { htmlClass, text }) {
  const element = document.createElement(tag);
  element.className = htmlClass ? htmlClass : '';
  element.innerText = text ? text : '';
  return element;
}

const makeForm = state => {
  const sendButton = create('button', {
    text: 'Send email',
    htmlClass: 'button',
  });

  sendButton.addEventListener('click', () =>
    sendMail(state.id, state.userInfo.name, state.userInfo.email, state.mp.name)
  );

  empty(container);
  emailTemplate.appendChild(sendButton);
  emailTemplate.style.display = 'inherit';
  emailTemplate.querySelector('#mp-name').innerText = state.mp.name;
  emailTemplate.querySelector('#user-name').innerText = state.userInfo.name;
};

function sendMail(id, name, email, mpName) {
  const userInput = getUserInput();
  fetch('/api/send-mail', {
    method: 'POST',
    body: JSON.stringify({
      id,
      name,
      email,
      mpName,
      userInput: userInput || '',
    }),
  })
    .then(verificationSent)
    .catch(showError);
}

function getUserInput() {
  const textArea = document.getElementById('activist-custom-message');
  return textArea.value;
}

function showLoader(text) {
  const loaderWrap = document.getElementById('activist-loading-container');
  loaderWrap.classList.add('activist-loading-container--show');
  if (text) {
    loaderWrap.querySelector('#activist-loading').innerText = text;
  }
}

function hideLoader() {
  const loaderWrap = document
    .getElementById('activist-loading-container')
    .classList.remove('activist-loading-container--show');
}

function empty(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function showError(error) {
  const err = create('p', 'activist-error');
  err.innerText = error.message;
  userDataForm.style.display = 'initial';
  container.appendChild(err);
}

function recaptchaSuccess(response) {
  setState({ recaptcha: response });
}

function recaptchaExpire() {
  setState({ recaptcha: null });
}

function verificationSent() {
  empty(container);
  emailTemplate.style.display = 'none';
  const wrap = create('div', { htmlClass: 'activist-intro' });

  const title = create('h1', { text: 'Verification email sent' });
  const para = create('p', {
    text: 'Please click the link in your email to complete the process.',
  });

  wrap.appendChild(title);
  wrap.appendChild(para);
  container.appendChild(wrap);
  window.location.href = '#activist-army-start';
}

function createCard(mp) {
  const card = create('article', {
    htmlClass: 'mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10',
  });
  const centerer = create('div', { htmlClass: 'tc' });
  const candidateImage = create('img', {
    htmlClass: 'br-100 h4 w4 dib ba b--black-05 pa2',
  });
  candidateImage.alt = `Picture of ${mp.name}`;
  candidateImage.src = mp.photo;
  centerer.appendChild(candidateImage);
  const mpName = create('h1', { htmlClass: 'f3 mb2', text: mp.name });
  centerer.appendChild(mpName);
  const mpParty = create('h2', {
    htmlClass: 'f5 fw4 gray mt0',
    text: mp.party,
  });
  centerer.appendChild(mpParty);
  card.appendChild(centerer);
  container.appendChild(card);
}

function createTemplateCopy() {
  const tempContainer = create('section', { htmlClass: 'activist-intro' });
  const title = create('h2', {
    text: 'Ask your MP to support the #ActivistArmy!',
  });
  const instructions = create('p', {
    text: `Take a look at the email we'll send below, add anything extra you want to tell your MP in the box provided, then click 'Send Email'`,
  });
  const instructionsTwo = create('p', {
    text: `We'll send a confirmation email to the email address you provided to make sure you're you, click the link in there and we'll send the email to your MP!`,
  });
  tempContainer.appendChild(title);
  tempContainer.appendChild(instructions);
  tempContainer.appendChild(instructionsTwo);
  container.appendChild(tempContainer);
}
