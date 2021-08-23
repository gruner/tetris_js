import { ValidCoordinates } from "./validate";

describe('ValidCoordinates', function() {

  it('should validate that coordinates have x and y integers', function() {

    const testSets = [
      {
        coordinates: {x: 0, y: 0},
        expected: true
      },
      {
        coordinates: {x: 1, y: 0},
        expected: true
      },
      {
        coordinates: {x: 0, y: 1},
        expected: true
      },
      {
        coordinates: {x: 1.1, y: 1},
        expected: false
      },
      // {
      //   coordinates: {x: '1', y: 1},
      //   expected: false
      // },
      {
        coordinates: {x: 1, y: 1.1},
        expected: false
      },
      {
        coordinates: {x: 1.1, y: 1.1},
        expected: false
      },
      // {
      //   coordinates: {y: 1},
      //   expected: false
      // }
    ];
    for (let i = 0; i < testSets.length; i++) {
      const set = testSets[i];
      expect(ValidCoordinates(set.coordinates)).toEqual(set.expected);
    }
  });
});
