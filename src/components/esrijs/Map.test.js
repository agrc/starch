import { getTransTechQuery, getSpeedQuery } from './Map';

const fieldName = 'FIELD_NAME';

describe('Map', () => {
  describe('getTransTechQuery', () => {
    it('builds the correct trans type query', () => {
      const defaultTransType = {
        dsl: false,
        cable: false,
        fiber: false,
        fixed: false,
        mobile: false,
        wireline: false,
      };
      const tests = [
        [`${fieldName} IN (50)`, { ...defaultTransType, fiber: true }],
        [`${fieldName} IN (50)`, { ...defaultTransType, fiber: true }],
        [`${fieldName} IN (10,20,50)`, { ...defaultTransType, dsl: true, fiber: true }],
        [
          `${fieldName} IN (10,20,30,40,41,50)`,
          {
            ...defaultTransType,
            dsl: true,
            fiber: true,
            cable: true,
            wireline: true,
          },
        ],
        [
          `${fieldName} IN ()`,
          {
            dsl: false,
            cable: false,
            fiber: false,
            fixed: false,
            mobile: false,
            wireline: false,
          },
        ],
        [
          null,
          {
            dsl: true,
            cable: true,
            fiber: true,
            fixed: true,
            mobile: true,
            wireline: true,
          },
        ],
      ];

      tests.forEach(([expected, input]) => {
        expect(getTransTechQuery(input, fieldName)).toEqual(expected);
      });
    });
  });

  describe('getSpeedQuery', () => {
    it('adds speed queries', () => {
      const tests = [
        [`${fieldName} >= 10`, 10],
        [`${fieldName} >= 0.123`, 0.123],
        [null, null],
      ];

      tests.forEach(([expected, input]) => {
        expect(getSpeedQuery(input, fieldName)).toEqual(expected);
      });
    });
  });
});
