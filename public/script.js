const container = document.getElementById('activist-army-container');
const userDataForm = document.getElementById('activist-user-info');
const emailTemplate = document.getElementById('email-template');
let state = {
  userInfo: {},
  mp: null,
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
    .then(res => {
      setState({ mp: res.mp, id: res.id });
    })
    .then(makeForm)
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

  sendButton.addEventListener('click', () => {
    console.log('hi');
  });

  empty(container);
  emailTemplate.appendChild(sendButton);
  emailTemplate.style.display = 'inherit';
  emailTemplate.querySelector('#mp-name').innerText = state.mp.name;
  emailTemplate.querySelector('#user-name').innerText = state.userInfo.name;
};

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
