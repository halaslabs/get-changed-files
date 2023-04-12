import {getInputs} from '../src/input'

beforeEach(() => {
  delete process.env['INPUT_FORMAT']
  delete process.env['INPUT_TOKEN']
  delete process.env['INPUT_PATH-FILTERS']
  delete process.env['INPUT_PATH-EXCLUSIONS']
})

const setInputs = (
  format: string = 'csv',
  token: string = 'token',
  filters: string[] = [],
  exclusions: string[] = [],
) => {
  process.env['INPUT_FORMAT'] = format
  process.env['INPUT_TOKEN'] = token
  process.env['INPUT_PATH-FILTERS'] = filters.join('\n')
  process.env['INPUT_PATH-EXCLUSIONS'] = exclusions.join('\n')
}

// token and format return when supplied and correct values
test('get valid inputs', () => {
  setInputs()
  const {token, format} = getInputs()
  expect(token).toEqual('token')
  expect(format).toEqual('csv')
})

// test when format is missing we throw an error
test('format is not valid', async () => {
  setInputs('foo')
  expect(() => getInputs()).toThrowError()
})
// test when format is not valid type we throw an error
test('format is missing', () => {
  process.env['INPUT_TOKEN'] = 'token'
  expect(() => getInputs()).toThrowError()
})

// test when token is missing we throw an error
test('token is missing', () => {
  process.env['INPUT_FORMAT'] = 'csv'
  expect(() => getInputs()).toThrowError()
})

// test path-filters is optional
test('optional path-filters', () => {
  setInputs()
  const {filters} = getInputs()
  expect(filters).toEqual([])
})

// test path-filters accepts single line
test('single line path-filters', () => {
  setInputs('csv', 'token', ['/foo/'])
  const {filters} = getInputs()
  expect(filters).toEqual(['/foo/'])
})

// test path-filters accept multiple lines
test('multiple line path-filters', () => {
  setInputs('csv', 'token', ['/foo/', '*.bar'])
  const {filters} = getInputs()
  expect(filters).toEqual(['/foo/', '([^/]+)\\.bar'])
})

// test path-filters leaves regexps alone
test('unmodified regex', () => {
  setInputs('csv', 'token', ['/.github/'])
  const {filters} = getInputs()
  expect(filters).toEqual(['/.github/'])
})

// test path-filters converts glob to regex
test('glob to regex', () => {
  setInputs('csv', 'token', ['**/*.ts'])
  const {filters} = getInputs()
  expect(filters).toEqual(['(.+/)?([^/]+)\\.ts'])
})

// test path-filters throws error when not a glob or regexp
test('invalid path-filter', () => {
  setInputs('csv', 'token', ['foo'])
  expect(() => getInputs()).toThrowError()
})

// test path-exclusions is optional
test('optional path-exclusions', () => {
  setInputs()
  const {exclusions} = getInputs()
  expect(exclusions).toEqual([])
})

// test path-exclusions accepts single line
test('single line path-exclusions', () => {
  setInputs('csv', 'token', [], ['/foo/'])
  const {exclusions} = getInputs()
  expect(exclusions).toEqual(['/foo/'])
})

// test path-exclusions accept multiple lines
test('multiple line path-exclusions', () => {
  setInputs('csv', 'token', [], ['/foo/', '*.bar'])
  const {exclusions} = getInputs()
  expect(exclusions).toEqual(['/foo/', '([^/]+)\\.bar'])
})

// test path-exclusions leaves regexps alone
test('unmodified regex', () => {
  setInputs('csv', 'token', [], ['/.github/'])
  const {exclusions} = getInputs()
  expect(exclusions).toEqual(['/.github/'])
})

// test path-exclusions converts glob to regex
test('glob to regex', () => {
  setInputs('csv', 'token', [], ['**/*.ts'])
  const {exclusions} = getInputs()
  expect(exclusions).toEqual(['(.+/)?([^/]+)\\.ts'])
})

// test path-exclusions throws error when not a glob or regexp
test('invalid path-exclusion', () => {
  setInputs('csv', 'token', [], ['foo'])
  expect(() => getInputs()).toThrowError()
})
