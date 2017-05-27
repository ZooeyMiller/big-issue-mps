const appendToDom = array => {
  array.forEach(candidate => {
    const container = document.createElement('div');
    const name = document.createElement('p');
    const party = document.createElement('p');
    const email = document.createElement('p');
    const photo = document.createElement('img');
    name.innerText = candidate.name;
    party.innerText = candidate.party;
    email.innerText = candidate.email;
    photo.src = candidate.photo;
    container.appendChild(name);
    container.appendChild(email);
    container.appendChild(party);
    container.appendChild(photo);
    document.querySelector('body').appendChild(container);
  });
};

fetch('/api', {
  method: 'POST',
  body: JSON.stringify({
    emails: ['finnhodgkin@gmail.com', 'zooeyxmiller@gmail.com'],
    fromEmail: 'hello@blah.com',
    subject: 'i am upset',
    body: 'i am working',
  }),
})
  .then(res => res.json())
  .then(console.log);
