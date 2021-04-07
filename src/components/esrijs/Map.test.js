import config from '../../config';
import { getQueryFromFilter } from './Map';

const fieldNames = config.fieldNames;

describe('Map', () => {
  describe('getQueryFromFilter', () => {
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
        [`${fieldNames.TransTech} IN (50)`, { transType: { ...defaultTransType, fiber: true } }],
        [`${fieldNames.TransTech} IN (10,20,50)`, { transType: { ...defaultTransType, dsl: true, fiber: true } }],
        [
          `${fieldNames.TransTech} IN (10,20,30,40,41,50)`,
          { transType: { ...defaultTransType, dsl: true, fiber: true, cable: true, wireline: true } },
        ],
      ];

      tests.forEach(([expected, input]) => {
        expect(getQueryFromFilter(input)).toEqual(expected);
      });
    });
  });
});
