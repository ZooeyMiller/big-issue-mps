'use strict';

(function() {
  if (typeof NodeList.prototype.forEach === 'function') return false;
  NodeList.prototype.forEach = Array.prototype.forEach;
})();

(function() {
  var container = document.getElementById('activist-army-container');
  var userDataForm = document.getElementById('activist-user-info');
  var emailTemplate = document.getElementById('email-template');
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
    state.userInfo.postcode = event.target[2].value;
    showLoader();
    fetch('/api?postcode=' + event.target[2].value)
      .then(function(res) {
        if (res.status !== 200) {
          throw new Error('Invalid postcode');
          return;
        }
        return res.json();
      })
      .then(function(res) {
        hideLoader();
        return listCandidates(res);
      })
      .then(setState)
      .then(makeForm)
      .catch(function(res) {
        hideLoader();
        showError(res);
      });
    userDataForm.style.display = 'none';
    document.querySelector('.activist-intro').style.display = 'none';
  });

  function create(tag, htmlClass) {
    var element = document.createElement(tag);
    element.className = htmlClass;
    return element;
  }

  function showError(error) {
    removeError();
    if (error.message === 'Invalid postcode') {
      var err = create('p', 'activist-error');
      err.innerText = error.message;
      userDataForm.style.display = 'initial';
      container.appendChild(err);
    } else {
      throw error;
    }
  }

  function removeError() {
    var child = document.querySelector('.activist-error');
    if (child) {
      var parent = child.parentElement;
      parent.removeChild(child);
    }
  }

  document
    .querySelector('#activist-postcode')
    .addEventListener('change', removeError);

  function listCandidates(candidates) {
    hideLoader();
    emailTemplate.style.display = 'inherit';
    var senderName = create('p');
    senderName.innerText = state.userInfo.name;
    var senderPostcode = create('p');
    senderPostcode.innerText = state.userInfo.postcode;
    emailTemplate.appendChild(senderName);
    emailTemplate.appendChild(senderPostcode);
    candidates.forEach(function(candidate) {
      var label = create('label', 'activist-candidate__card-label');
      label.for = 'checkboxBox';
      var card = create('article', 'activist-candidate');
      var photo = create('img', 'activist-candidate__photo');
      photo.src = candidate.photo || './profile_blank.png';
      photo.alt = 'picture of ' + candidate.name;
      var name = create('h2', 'activist-candidate__name');
      name.innerText = candidate.name;
      var party = create('h3', 'activist-candidate__party');
      party.innerText = candidate.party;
      var checkbox = void 0;
      if (candidate.email) {
        var checkbox = create('label', 'activist-candidate__label');
        var checkboxBox = create('input', 'activist-candidate__checkbox');
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
    var index = state.candidates.findIndex(function(candidate) {
      return candidate.email === event.target.value;
    });
    var card = event.target.parentElement.parentElement;
    if (event.target.checked) {
      card.classList.add('activist-candidate--selected');
    } else {
      card.classList.remove('activist-candidate--selected');
    }
    setState({
      candidates: state.candidates.map(function(c, i) {
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
    if (
      state.candidates.every(function(candidate) {
        return !candidate.checked;
      })
    ) {
      document
        .getElementById('activist-send')
        .classList.add('activist-send--disabled');
      document
        .getElementById('activist-send2')
        .classList.add('activist-send--disabled');
    } else {
      document
        .getElementById('activist-send')
        .classList.remove('activist-send--disabled');
      document
        .getElementById('activist-send2')
        .classList.remove('activist-send--disabled');
    }
  }

  var makeForm = function makeForm() {
    var submit = create('button', 'button');
    submit.innerText = 'Send emails';
    submit.id = 'activist-send';
    var submit2 = create('button', 'button');
    submit2.innerText = 'Send emails';
    submit2.id = 'activist-send2';
    if (
      state.candidates.every(function(candidate) {
        return !candidate.checked;
      })
    ) {
      submit.classList.add('activist-send--disabled');
      submit2.classList.add('activist-send--disabled');
    }
    var userAddition = create('textarea', 'activist--user-contribution');
    userAddition.placeholder =
      'Add a personal message to your candidates. Your note will appear in the [Your message here] section.';
    userAddition.id = 'user-addition-form';

    var instructions = create('h3', 'activist-instructions');
    instructions.innerText =
      "Please select which candidates you'd like to email.";
    document
      .querySelector('.post_content')
      .insertBefore(instructions, container);
    container.appendChild(submit);
    emailTemplate.appendChild(submit2);
    container.appendChild(userAddition);
    submit.addEventListener('click', sendEmailsEvent);
    submit2.addEventListener('click', sendEmailsEvent);
  };

  function sendEmailsEvent(event) {
    event.preventDefault();

    if (
      state.candidates.some(function(candidate) {
        return candidate.checked;
      })
    ) {
      var emailArr = state.candidates
        .filter(function(candidate) {
          return candidate.checked;
        })
        .map(function(candidate) {
          return { email: candidate.email, name: candidate.name };
        });
      var userInput = document.getElementById('user-addition-form').value;

      container.innerHTML = '';
      document.getElementById('activist-army-start').scrollIntoView();
      emailTemplate.style.display = 'none';
      document.querySelector('.activist-instructions').style.display = 'none';

      showLoader('Sending emails...');
      sendEmails(
        emailArr,
        {
          email: state.userInfo.email,
          name: state.userInfo.name,
        },
        userInput
      )
        .then(emailSent)
        .catch(emailError);
    }
  }

  function emailSent() {
    document.getElementById('activist-army-start').scrollIntoView();
    container.innerHTML = '';
    emailTemplate.style.display = 'none';

    var thanks = create('h2');
    var subThanks = create('h3');
    thanks.innerText = 'Emails successfully sent!';
    subThanks.innerText =
      'Thanks for taking The Big Issue campaign to your candidates - now spread the word on ';
    var subLink = create('a');
    subLink.innerText = 'your own social media!';
    subLink.href = 'https://ctt.ec/GW0Ja';
    subThanks.appendChild(subLink);
    thanks.appendChild(subThanks);
    container.appendChild(thanks);
  }

  function emailError(res) {
    document.getElementById('activist-army-start').scrollIntoView();
    container.innerHTML = '';
    emailTemplate.style.display = 'none';

    if (
      res.error &&
      res.error.findIndex(function(email) {
        return email.ErrorCode === 0;
      }) === -1
    ) {
      var errorHeader = create('h2');
      errorHeader.innerText = 'Error';
      var error = create('p');
      error.id = 'activist-email-error';
      error.innerText = 'The email delivery failed. ';
      var errorLink = create('a');
      errorLink.href = '#';
      errorLink.innerText = 'Click here to try again.';
      error.appendChild(errorLink);
      errorLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.reload();
      });
      container.appendChild(errorHeader);
      container.appendChild(error);
    } else {
      emailSent();
    }
  }

  function sendEmails(emailArr, from, userInput) {
    return new Promise(function(reject, resolve) {
      fetch('/api', {
        method: 'POST',
        body: JSON.stringify({
          emails: [{ name: 'Finn', email: 'finnhodgkin@gmail.com' }],
          fromEmail: from,
          userInput: userInput,
        }),
      })
        .then(function(res) {
          hideLoader();
          return res.json();
        })
        .then(resolve)
        .catch(function(res) {
          hideLoader();
          return reject(res);
        });
    });
  }

  function showLoader(text) {
    var loaderWrap = document.getElementById('activist-loading-container');
    loaderWrap.classList.add('activist-loading-container--show');
    if (text) {
      loaderWrap.querySelector('#activist-loading').innerText = text;
    }
  }

  function hideLoader() {
    var loaderWrap = document
      .getElementById('activist-loading-container')
      .classList.remove('activist-loading-container--show');
  }

  var normaliseHeights = function normaliseHeights(nodeList) {
    var tallest = Math.max.apply(
      null,
      Array.from(nodeList).map(function(e) {
        return e.clientHeight;
      })
    );
    nodeList.forEach(function(card) {
      return (card.style.height = tallest + 18 + 'px');
    });
  };
})();
