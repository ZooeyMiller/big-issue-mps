var userDataForm = document.getElementById('activist-user-info');
var userInfo = {};

userDataForm.addEventListener('submit', function(event) {
  event.preventDefault();
  userInfo.name = event.target[0].value;
  userInfo.email = event.target[1].value;
  fetch('/api?postcode=' + event.target[2].value)
    .then(function(res) {
      return res.json();
    })
    .then(listCandidates);

  userDataForm.style.display = 'none';
  //@TODO add spinner
});

function create(tag, htmlClass) {
  var element = document.createElement(tag);
  element.className = htmlClass;
  return element;
}

function listCandidates(candidates) {
  console.log(candidates, 'hi');
  //@TODO HIDE SPINNER
  var table = create('table', 'activist-table');
  var thead = create('thead');
  table.appendChild(thead);
  var tr = create('tr', 'activist-tr');
  thead.appendChild(tr);
  var thEmail = create('th', 'activist-th');
  thEmail.innerText = 'Email';
  var thCandidate = create('th', 'activist-th');
  thCandidate.innerText = 'Candidate';
  var thParty = create('th', 'activist-th');
  thParty.innerText = 'Party';
  tr.appendChild(thEmail);
  tr.appendChild(thCandidate);
  tr.appendChild(thParty);
  var tbody = create('tbody');
  table.appendChild(tbody);

  candidates.forEach(function(candidate) {
    var candidateRow = create('tr', 'activist-tr');

    var emailBox = create('input');
    emailBox.type = 'checkbox';
    emailBox.checked = true;
    emailBox.value = candidate.email;

    var emailFail = create('span');
    emailFail.innerText = 'No email on record.';

    var candidateEmail = candidate.email ? emailBox : emailFail;

    var candidateName = candidate.name;
    var candidateParty = candidate.party;

    var emailTd = create('td');
    emailTd.appendChild(candidateEmail);

    var candidateTd = create('td');
    candidateTd.innerText = candidateName;

    var partyTd = create('td');
    partyTd.innerText = candidateParty;

    candidateRow.appendChild(emailTd);
    candidateRow.appendChild(candidateTd);
    candidateRow.appendChild(partyTd);
    tbody.appendChild(candidateRow);
  });

  console.log(table);
  var container = document.getElementById('activist-army-container');
  container.appendChild(table);
}
// fetch('/api', {
//   method: 'POST',
//   body: JSON.stringify({
//     emails: ['finnhodgkin@gmail.com', 'zooeyxmiller@gmail.com'],
//     fromEmail: 'hello@blah.com',
//     subject: 'i am upset',
//     body: 'i am working',
//   }),
// })
//   .then(res => res.json())
//   .then(console.log);
