const request = require('request-promise');
require('env2')('.config.env');

const fetchConstituencyInfo = postcode => {
  return new Promise((resolve, reject) => {
    request({
      uri: `https://mapit.mysociety.org/postcode/${postcode}`,
      headers: {
        'X-Api-Key': process.env.MAPIT_API,
      },
      json: true,
    })
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
};

const fetchCandidates = constituencyId => {
  return new Promise((resolve, reject) => {
    request({
      uri: `https://candidates.democracyclub.org.uk/api/v0.9/posts/WMC:${constituencyId}/`,
      json: true,
    })
      .then(json => resolve(json))
      .catch(error => reject(error));
  });
};

const findConstituencyId = ({ areas }) => {
  return areas[
    Object.keys(areas).find(e => {
      return areas[e].type === 'WMC';
    })
  ].codes.gss;
  //@TODO error handling
};

const buildCandidateUrls = ({ memberships }) => {
  return memberships.map(object => {
    return request({
      uri: `https${object.person.url.slice(4)}`,
      json: true,
    });
  });
};

const findParty = ({ memberships }) => {
  const generalElection = memberships.find(item => {
    return item.election.name === '2017 General Election';
  });
  if (generalElection) {
    return generalElection.on_behalf_of.name;
  }
  return false;
};

const buildCandidates = objectArray => {
  return objectArray
    .map(candidate => {
      const party = findParty(candidate);
      if (party) {
        return {
          party,
          name: candidate.name,
          email: candidate.email,
          photo: `https://candidates.democracyclub.org.uk/${candidate.images[0].image_url}`,
        };
      }
    })
    .filter(e => e); //this removes falsey elements
};

const getCandidates = postcode => {
  return new Promise((resolve, reject) => {
    fetchConstituencyInfo(postcode)
      .then(findConstituencyId)
      .then(fetchCandidates)
      .then(buildCandidateUrls)
      .then(arr =>
        Promise.all(arr).then(buildCandidates).then(resolve).catch(reject)
      )
      .catch(reject);
  });
};

module.exports = getCandidates;
