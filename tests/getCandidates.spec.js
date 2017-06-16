const tape = require('tape');
const {
  buildCandidate,
  buildCandidateUrl,
  findMp,
  findParty,
  findConstituencyId,
  fetchConstituencyInfo,
  fetchCandidate,
} = require('../src/utils/getCandidates');

const add = (a, b) => a + b;
tape('testing the test', t => {
  t.plan(1);
  t.equal(add(1, 2), 3, 'calling add(1, 2) should return 3');
});

tape('Testing buildCandidate', t => {
  const testCandidate = {
    name: 'John Doe',
    email: 'name@thing.com',
    thumbnail: 'www.picture.com',
    memberships: [
      {
        election: { name: 'Not an Election' },
        on_behalf_of: { name: 'Labour' },
      },
      {
        election: {
          name: '2017 General Election',
        },
        on_behalf_of: { name: 'Green' },
      },
    ],
  };
  const expected = {
    name: 'John Doe',
    email: 'name@thing.com',
    photo: 'www.picture.com',
    party: 'Green',
  };
  t.deepEqual(
    buildCandidate(testCandidate),
    expected,
    'buildCandidate gives expected output object with valid input'
  );
  t.end();
});

tape('Testing findParty', t => {
  t.plan(2);
  const testObjectOkay = {
    memberships: [
      {
        election: { name: 'Not an Election' },
        on_behalf_of: { name: 'Labour' },
      },
      {
        election: {
          name: '2017 General Election',
        },
        on_behalf_of: { name: 'Green' },
      },
    ],
  };

  const testObjectNotOkay = {
    memberships: [
      {
        election: { name: 'Not an Election' },
        on_behalf_of: { name: 'Labour' },
      },
      {
        election: {
          name: '2016 General Election',
        },
        on_behalf_of: { name: 'Green' },
      },
    ],
  };

  t.equal(
    findParty(testObjectOkay),
    'Green',
    'Should return name of party relevant to 2017 General Election when present'
  );
  t.equal(
    findParty(testObjectNotOkay),
    false,
    'Should return false if no 2017 General Election object present'
  );
});

tape('Testing findMp', t => {
  t.plan(2);
  const testObject = {
    memberships: [
      {
        id: 149937,
        url: 'http://candidates.democracyclub.org.uk/api/v0.9/memberships/149937/',
        label: '',
        role: 'Candidate',
        elected: false,
        party_list_position: null,
        person: {
          id: 142,
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/persons/142/',
          name: 'Ajmal Masroor',
        },
        organization: null,
        on_behalf_of: {
          id: 'ynmp-party:2',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/organizations/ynmp-party:2/',
          name: 'Independent',
        },
        post: {
          id: 'WMC:E14000555',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/posts/WMC:E14000555/',
          label: 'Bethnal Green and Bow',
          slug: 'WMC:E14000555',
        },
        start_date: null,
        end_date: null,
        election: {
          id: 'parl.2017-06-08',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/elections/parl.2017-06-08/',
          name: '2017 General Election',
        },
      },
      {
        id: 99471,
        url: 'http://candidates.democracyclub.org.uk/api/v0.9/memberships/99471/',
        label: '',
        role: 'Candidate',
        elected: true,
        party_list_position: null,
        person: {
          id: 143,
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/persons/143/',
          name: 'Rushanara Ali',
        },
        organization: null,
        on_behalf_of: {
          id: 'party:53',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/organizations/party:53/',
          name: 'Labour Party',
        },
        post: {
          id: 'WMC:E14000555',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/posts/WMC:E14000555/',
          label: 'Bethnal Green and Bow',
          slug: 'WMC:E14000555',
        },
        start_date: null,
        end_date: null,
        election: {
          id: 'parl.2017-06-08',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/elections/parl.2017-06-08/',
          name: '2017 General Election',
        },
      },
    ],
  };
  const expected = {
    id: 99471,
    url: 'http://candidates.democracyclub.org.uk/api/v0.9/memberships/99471/',
    label: '',
    role: 'Candidate',
    elected: true,
    party_list_position: null,
    person: {
      id: 143,
      url: 'http://candidates.democracyclub.org.uk/api/v0.9/persons/143/',
      name: 'Rushanara Ali',
    },
    organization: null,
    on_behalf_of: {
      id: 'party:53',
      url: 'http://candidates.democracyclub.org.uk/api/v0.9/organizations/party:53/',
      name: 'Labour Party',
    },
    post: {
      id: 'WMC:E14000555',
      url: 'http://candidates.democracyclub.org.uk/api/v0.9/posts/WMC:E14000555/',
      label: 'Bethnal Green and Bow',
      slug: 'WMC:E14000555',
    },
    start_date: null,
    end_date: null,
    election: {
      id: 'parl.2017-06-08',
      url: 'http://candidates.democracyclub.org.uk/api/v0.9/elections/parl.2017-06-08/',
      name: '2017 General Election',
    },
  };
  const testObjectTwo = {
    memberships: [
      {
        id: 149937,
        url: 'http://candidates.democracyclub.org.uk/api/v0.9/memberships/149937/',
        label: '',
        role: 'Candidate',
        elected: false,
        party_list_position: null,
        person: {
          id: 142,
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/persons/142/',
          name: 'Ajmal Masroor',
        },
        organization: null,
        on_behalf_of: {
          id: 'ynmp-party:2',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/organizations/ynmp-party:2/',
          name: 'Independent',
        },
        post: {
          id: 'WMC:E14000555',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/posts/WMC:E14000555/',
          label: 'Bethnal Green and Bow',
          slug: 'WMC:E14000555',
        },
        start_date: null,
        end_date: null,
        election: {
          id: 'parl.2017-06-08',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/elections/parl.2017-06-08/',
          name: '2017 General Election',
        },
      },
      {
        id: 99471,
        url: 'http://candidates.democracyclub.org.uk/api/v0.9/memberships/99471/',
        label: '',
        role: 'Candidate',
        elected: false,
        party_list_position: null,
        person: {
          id: 143,
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/persons/143/',
          name: 'Rushanara Ali',
        },
        organization: null,
        on_behalf_of: {
          id: 'party:53',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/organizations/party:53/',
          name: 'Labour Party',
        },
        post: {
          id: 'WMC:E14000555',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/posts/WMC:E14000555/',
          label: 'Bethnal Green and Bow',
          slug: 'WMC:E14000555',
        },
        start_date: null,
        end_date: null,
        election: {
          id: 'parl.2017-06-08',
          url: 'http://candidates.democracyclub.org.uk/api/v0.9/elections/parl.2017-06-08/',
          name: '2017 General Election',
        },
      },
    ],
  };
  t.deepEqual(
    findMp(testObject),
    expected,
    'Should return an candidate object when passed proper input'
  );
  t.throws(
    () => findMp(testObjectTwo),
    /Error: No elected candidate found./,
    'Should throw an error if no candidate found'
  );
});
