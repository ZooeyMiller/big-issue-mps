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
    recaptchaError();
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
        return;
      }
      return res.json();
    })
    .then(res => {
      hideLoader();
      return res;
    })
    .then(res => setState({ mp: res.mp, id: res.id }))
    .then(makeForm)
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
  });
  //TODO ADD FEEDBACK AFTER MAIL SENT
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

function recaptchaError() {
  console.log('RECAPTCHAERRRROOOOORRRRR!!!!');
}
