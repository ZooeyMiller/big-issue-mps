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

const fetchCandidate = constituencyId => {
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
  const area =
    areas[
      Object.keys(areas).find(e => {
        return areas[e].type === 'WMC';
      })
    ].codes.gss;
  if (!area) throw new Error('No constituency id found. Bad postcode?');
  return area;
};

const findMp = ({ memberships }) => {
  const candidate = memberships.find(object => object.elected);

  if (!candidate) throw new Error('No elected candidate found.');
  return candidate;
};

const buildCandidateUrl = candidate => {
  return request({
    uri: `https${candidate.person.url.slice(4)}`,
    json: true,
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

const buildCandidate = candidateObject => {
  const party = findParty(candidateObject);

  const candidate = {
    party,
    name: candidateObject.name,
    email: candidateObject.email,
    photo: candidateObject.thumbnail,
  };

  return candidate;
};

const getCandidates = postcode => {
  return new Promise((resolve, reject) => {
    fetchConstituencyInfo(postcode)
      .then(findConstituencyId)
      .then(fetchCandidate)
      .then(findMp)
      .then(buildCandidateUrl)
      .then(buildCandidate)
      .then(resolve)
      .catch(reject);
  });
};

module.exports = {
  getCandidates,
  buildCandidate,
  buildCandidateUrl,
  findMp,
  findParty,
  findConstituencyId,
  fetchConstituencyInfo,
  fetchCandidate,
};
