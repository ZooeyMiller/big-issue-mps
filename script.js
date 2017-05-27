const candidateArray = [];

fetch('https://mapit.mysociety.org/postcode/po383de')
  .then(res => res.json())
  .then(({ areas }) => {
    const constituency =
      areas[
        Object.keys(areas).find(e => {
          return areas[e].type === 'WMC';
        })
      ];
    console.log(constituency);

    fetch(
      `https://candidates.democracyclub.org.uk/api/v0.9/posts/WMC:${constituency.codes.gss}/`
    )
      .then(res => res.json())
      .then(json => {
        console.log(json);
        const allTheCandidates = json.memberships.map(object => {
          return fetch(`https${object.person.url.slice(4)}`);
        });
        Promise.all(allTheCandidates)
          .then(res => {
            res.forEach(e => {
              e.json().then(candidate => {
                const party = findParty(candidate);
                if (party) {
                  candidateArray.push({
                    party,
                    name: candidate.name,
                    email: candidate.email,
                  });
                }
              });
            });
          })
          .then(() => console.log(candidateArray));
      });
  });

const findParty = ({ memberships }) => {
  const generalElection = memberships.find(item => {
    return item.election.name === '2017 General Election';
  });
  if (generalElection) {
    return generalElection.on_behalf_of.name;
  }
  return false;
};
