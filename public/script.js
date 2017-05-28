var container = document.getElementById('activist-army-container');
var userDataForm = document.getElementById('activist-user-info');
var state = {
  userInfo: {},
  candidates: [],
};

function setState(stateProps) {
  Object.keys(stateProps).forEach(function(propName) {
    state[propName] = stateProps[propName];
  });
}

userDataForm.addEventListener('submit', function(event) {
  event.preventDefault();
  state.userInfo.name = event.target[0].value;
  state.userInfo.email = event.target[1].value;
  fetch('/api?postcode=' + event.target[2].value)
    .then(function(res) {
      console.log(res);
      //in here we find what status code is
      if (res.status !== 200) {
        throw new Error('Invalid postcode');
        return;
      }
      return res.json();
    })
    .then(listCandidates)
    .then(setState)
    .then(makeForm)
    .catch(showError);
  userDataForm.style.display = 'none';
  //@TODO add spinner
});

function create(tag, htmlClass) {
  var element = document.createElement(tag);
  element.className = htmlClass;
  return element;
}

function showError(error) {
  const err = create('p', 'activist-error');
  err.innerText = error.message;
  userDataForm.style.display = 'initial';
  container.appendChild(err);
}

function listCandidates(candidates) {
  //@TODO HIDE SPINNER
  const emailTemplate = document.getElementById('email-template');
  emailTemplate.style.display = 'inherit';
  console.log(candidates);
  candidates.forEach(candidate => {
    const label = create('label', 'activist-candidate__card-label');
    label.for = 'checkboxBox';
    const card = create('article', 'activist-candidate');
    const photo = create('img', 'activist-candidate__photo');
    photo.src = candidate.photo || './profile_blank.png'; //@TODO add photos to state;
    photo.alt = `picture of ${candidate.name}`;
    const name = create('h2', 'activist-candidate__name');
    name.innerText = candidate.name;
    const party = create('h3', 'activist-candidate__party');
    party.innerText = candidate.party;
    let checkbox;
    if (candidate.email) {
      checkbox = create('label', 'activist-candidate__label');
      checkboxBox = create('input', 'activist-candidate__checkbox');
      checkbox.innerText = 'Send email: ';
      checkboxBox.type = 'checkbox';
      card.className += ' activist-candidate--selected';
      checkboxBox.checked = true;
      checkboxBox.value = candidate.email;
      checkboxBox.addEventListener('change', checkboxHandler);
      checkbox.appendChild(checkboxBox);
    } else {
      checkbox = create('p', 'activist-candidate__no-email');
      checkbox.innerText = 'No email';
    }
    card.appendChild(photo);
    card.appendChild(name);
    card.appendChild(party);
    card.appendChild(checkbox);
    label.appendChild(card);
    container.appendChild(label);
  });
  normaliseHeights(document.querySelectorAll('.activist-candidate'));
  // container.appendChild(table);
  console.log('CHECK HERE', candidates);
  return {
    candidates: candidates.map(function(c) {
      return {
        name: c.name,
        party: c.party,
        email: c.email,
        photo: c.photo,
        checked: c.email ? true : false,
      };
    }),
  };
}

function checkboxHandler(event) {
  const index = state.candidates.findIndex(
    candidate => candidate.email === event.target.value
  );
  const card = event.target.parentElement.parentElement;
  if (event.target.checked) {
    card.classList.add('activist-candidate--selected');
  } else {
    card.classList.remove('activist-candidate--selected');
  }
  setState({
    candidates: state.candidates.map((c, i) => {
      if (i === index) {
        return {
          name: c.name,
          email: c.email,
          party: c.party,
          photo: c.photo,
          checked: event.target.checked,
        };
      }
      return c;
    }),
  });
  if (state.candidates.every(candidate => !candidate.checked)) {
    document
      .getElementById('activist-send')
      .classList.add('activist-send--disabled');
  } else {
    document
      .getElementById('activist-send')
      .classList.remove('activist-send--disabled');
  }
}

const makeForm = () => {
  const submit = create('button', 'button');
  submit.innerText = 'Send emails';
  submit.id = 'activist-send';
  if (state.candidates.every(candidate => !candidate.checked)) {
    submit.classList.add('activist-send--disabled');
  }

  container.appendChild(submit);

  submit.addEventListener('click', event => {
    event.preventDefault();
    if (state.candidates.some(candidate => candidate.checked)) {
      const emailArr = state.candidates
        .filter(candidate => candidate.checked)
        .map(candidate => ({ email: candidate.email, name: candidate.name }));
      sendEmails(emailArr, {
        email: state.userInfo.email,
        name: state.userInfo.name,
      })
        .then(res => console.log('then', res))
        .catch(err => console.log('catch', err));
    }
  });
};

function sendEmails(emailArr, from) {
  console.log(emailArr);
  return new Promise((reject, resolve) => {
    fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        emails: [
          { email: 'notanemial', name: 'Finn' },
          { email: 'zooeyxmiller@gmail.com', name: 'zooey' },
        ],
        fromEmail: from,
      }),
    })
      .then(res => res.json())
      .then(resolve)
      .catch(reject);
  });
}

const normaliseHeights = nodeList => {
  const tallest = Math.max.apply(
    null,
    Array.from(nodeList).map(e => e.clientHeight)
  );
  nodeList.forEach(card => (card.style.height = `${tallest + 18}px`));
};
