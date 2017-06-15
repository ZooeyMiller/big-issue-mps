const container = document.getElementById('activist-army-container');
const userDataForm = document.getElementById('activist-user-info');
const emailTemplate = document.getElementById('email-template');
let state = {
  userInfo: {},
  mp: null,
  id: null,
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
  showLoader();
  fetch('/api/get-candidate', {
    method: 'POST',
    body: JSON.stringify({
      name: state.userInfo.name,
      email: state.userInfo.email,
      postcode: state.userInfo.postcode,
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
    .then(() => createCard(state.mp))
    .catch(res => {
      hideLoader();
      showError(res);
    });
  userDataForm.style.display = 'none';
});

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
