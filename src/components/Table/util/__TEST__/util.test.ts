import {
  FILTER_TYPES,
  filterRows,
  searchMatch,
} from '../index';
// import type { IPokemonQueryDatum, ITypeQueryDatum } from '../../interfaces';

describe('Util', () => {

  describe('searchMatch', () => {
    it('returns false if no value provided', async () => {
      expect(searchMatch('', '')).toBe(false)
    })
    it('returns true for same string', async () => {
      expect(searchMatch('dsafdg', 'dsafdg')).toBe(true)
    })
    it('ignores character case', async () => {
      expect(searchMatch('DsaFdg', 'dsafdg')).toBe(true)
    })
    it('returns true for partial matches', async () => {
      expect(searchMatch('DsaFdg', 'fd')).toBe(true)
    })
  })

  describe('filterRows', () => {
    const FIELD = 'testField';
    const FIELD2 = 'testField2';
    const mockRows = [
      { [FIELD]: 'bc' }, 
      { [FIELD]: 'asdf', [FIELD2]: 'exists1' }, 
      { [FIELD]: 'abc', [FIELD2]: 'exists3' },  
      { [FIELD]: 'abc', [FIELD2]: 'exists2'}, 
    ];
    const filters = [
      // search filter
      {
        type: FILTER_TYPES.SEARCH,
        field: FIELD,
        value: 'a',
      },
      // select filter
      {
        type: FILTER_TYPES.SELECT,
        field: FIELD2,
        value: ['exists1', 'exists2'],
      },
      // custom filter
      {
        type: FILTER_TYPES.CUSTOM,
        filterMethod: (row: any) => row[FIELD].length < 4,
      },
    ]
    it('applies search filters', async () => {
      expect(filterRows(mockRows, [filters[0]]).length).toEqual(3);
      expect(filterRows(mockRows, [filters[0]])[0]).toEqual(mockRows[1]);
    })
    it('applies select filters', async () => {
      expect(filterRows(mockRows, [filters[1]]).length).toEqual(2);
      expect(filterRows(mockRows, [filters[1]])[0]).toEqual(mockRows[1]);
    })
    it('applies custom filters', async () => {
      expect(filterRows(mockRows, [filters[2]]).length).toEqual(3);
      expect(filterRows(mockRows, [filters[2]])[0]).toEqual(mockRows[0]);
    })
    it('applies concurrent filters', async () => {
      expect(filterRows(mockRows, filters).length).toEqual(1);
      expect(filterRows(mockRows, filters)[0]).toEqual(mockRows[3]);
    })
  })
})

