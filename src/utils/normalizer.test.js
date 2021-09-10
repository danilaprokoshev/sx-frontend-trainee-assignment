import normalizeData from './normalizer';

const data = [
  {
    id: 28480892,
    by: 'seibelj',
    time: 1631285338,
  },
  {
    id: 28480869,
    by: 'dandaan',
    time: 1631278791,
  }
];

const expectedData = {
  byId: {
    '28480892': {
      id: 28480892,
      by: 'seibelj',
      time: '10/09/2021',
    },
    '28480869': {
      id: 28480869,
      by: 'dandaan',
      time: '10/09/2021',
    }
  },
  allIds: [28480892, 28480869]
};

test('shows difference in plain format', () => {
  expect(normalizeData(data)).toEqual(expectedData);
});
