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
  // var table = create('table', 'activist-table');
  // var thead = create('thead');
  // table.appendChild(thead);
  // var tr = create('tr', 'activist-tr');
  // thead.appendChild(tr);
  // var thEmail = create('th', 'activist-th');
  // thEmail.innerText = 'Email';
  // var thCandidate = create('th', 'activist-th');
  // thCandidate.innerText = 'Candidate';
  // var thParty = create('th', 'activist-th');
  // thParty.innerText = 'Party';
  // tr.appendChild(thEmail);
  // tr.appendChild(thCandidate);
  // tr.appendChild(thParty);
  // var tbody = create('tbody');
  // table.appendChild(tbody);

  // candidates.forEach(function(candidate) {
  //   var candidateRow = create('tr', 'activist-tr');
  //
  //   var emailBox = create('input');
  //   emailBox.type = 'checkbox';
  //   emailBox.checked = true;
  //   emailBox.value = candidate.email;
  //   });

  // var emailFail = create('span');
  // emailFail.innerText = 'No email on record.';
  //
  // var candidateEmail = candidate.email ? emailBox : emailFail;
  //
  // var candidateName = candidate.name;
  // var candidateParty = candidate.party;
  //
  // var emailTd = create('td');
  // emailTd.appendChild(candidateEmail);
  //
  // var candidateTd = create('td');
  // candidateTd.innerText = candidateName;
  //
  // var partyTd = create('td');
  // partyTd.innerText = candidateParty;
  //
  // candidateRow.appendChild(emailTd);
  // candidateRow.appendChild(candidateTd);
  // candidateRow.appendChild(partyTd);
  // tbody.appendChild(candidateRow);
  // });
  console.log(candidates);
  candidates.forEach(candidate => {
    const card = create('article', 'activist-candidate');
    card.style.backgroundColor = 'red';
    const photo = create('img', 'activist-candidate__photo');
    photo.src = candidate.photo; //@TODO add photos to state;
    photo.alt = `picture of ${candidate.name}`;
    const name = create('h2', 'activist-candidate__name');
    name.innerText = candidate.name;
    const party = create('h3', 'activist-candidate__party');
    party.innerText = candidate.party;
    let checkbox;
    if (candidate.email) {
      checkbox = create('input', 'activist-candidate__checkbox');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.value = candidate.email;
      checkbox.addEventListener('change', function(event) {
        const index = state.candidates.findIndex(
          candidate => candidate.email === event.target.value
        );
        setState({
          candidates: state.candidates.map((c, i) => {
            if (i === index) {
              return {
                name: c.name,
                email: c.email,
                party: c.part,
                checked: event.target.checked,
              };
            }
            return c;
          }),
        });
      });
    } else {
      checkbox = create('p', 'activist-candidate__no-email');
      checkbox.innerText = 'No email on record';
    }
    card.appendChild(name);
    card.appendChild(party);
    card.appendChild(photo);
    card.appendChild(checkbox);
    container.appendChild(card);
  });

  // container.appendChild(table);
  return {
    candidates: candidates.map(function(c) {
      return {
        name: c.name,
        party: c.party,
        email: c.email,
        checked: c.email ? true : false,
      };
    }),
  };
}

//@TODO add labels to inputs
const makeForm = () => {
  const form = create('form', 'activist-form');
  const subject = create('input', 'activist-input');
  subject.type = 'text';
  subject.value = `${state.userInfo.name}: subject line`;
  const body = create('textarea', 'activist-text-area');
  body.rows = '4';
  body.cols = '4';
  body.innerText = 'i care about things\n\nreally really things';
  const submit = create('button', 'button');
  submit.innerText = 'Send emails';
  submit.type = 'submit';

  form.appendChild(subject);
  form.appendChild(body);
  form.appendChild(submit);

  form.addEventListener('submit', event => {
    event.preventDefault();
    const emailArr = state.candidates
      .filter(candidate => candidate.checked)
      .map(candidate => ({ email: candidate.email, name: candidate.name }));
    console.log(body.innerText);
    sendEmails(emailArr, {
      email: state.userInfo.email,
      name: state.userInfo.name,
    })
      .then(res => console.log('then', res))
      .catch(err => console.log('catch', err));
  });

  container.appendChild(form);
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
