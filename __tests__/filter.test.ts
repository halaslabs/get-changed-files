import fs from 'fs'
import {filterFiles} from '../src/filter'

const getFiles = () => {
  return JSON.parse(
    fs.readFileSync(`${__dirname}/fixtures/compareResponse.json`, 'utf8')
  ).files
}

//test when no filters are provided all files are returned
test('no filters', () => {
  const filters = [] as string[]
  const files = filterFiles(filters, [], getFiles())
  expect(files.length).toBe(8)
})

//test no filters match
test('no matching files', () => {
  const filters = ['nothing']
  const files = filterFiles(filters, [], getFiles())
  expect(files.length).toBe(0)
})

//test single filter matches single file
test('one matching file', () => {
  const filters = ['/^added.txt$/']
  const files = filterFiles(filters, [], getFiles())
  expect(files[0].filename).toBe('added.txt')
})

//test single filter matches multiple files
test('multiple matching files', () => {
  const filters = ['/added.txt/']
  const files = filterFiles(filters, [], getFiles())
  expect(files.length).toBe(4)
})

//test multiple filters match single file
test('multiple matching filters to single file', () => {
  const filters = ['/path4/', '/.*/.*/.*/']
  const files = filterFiles(filters, [], getFiles())
  expect(files[0].filename).toBe('path3/path4/added.txt')
})

//test multiple filters match multiple files
test('multiple matching filters to multiple files', () => {
  const filters = ['/path1/', '/path2/']
  const files = filterFiles(filters, [], getFiles())
  expect(files.length).toBe(3)
})

//test when no exclusions are provided all files are returned
test('no exclusions', () => {
  const exclusions = [] as string[]
  const files = filterFiles([], exclusions, getFiles())
  expect(files.length).toBe(8)
})

//test no exclusions match
test('no matching exclusions', () => {
  const exclusions = ['nothing']
  const files = filterFiles([], exclusions, getFiles())
  expect(files.length).toBe(8)
})

//test single exclusion excludes single file
test('one exclusion, excludes single file', () => {
  const exclusions = ['/^removed.txt/']
  const files = filterFiles([], exclusions, getFiles())
  expect(files.length).toBe(7)
})

//test single exclusion excludes multiple files
test('one exclusion, excludes multiple files', () => {
  const exclusions = ['/added.txt/']
  const files = filterFiles([], exclusions, getFiles())
  expect(files.length).toBe(4)
})

//test multiple exclusions exclude single file
test('multiple exclusions, exclude single file', () => {
  const exclusions = ['/path4/', '/path3/']
  const files = filterFiles([], exclusions, getFiles())
  expect(files.length).toBe(7)
})

//test multiple exclusions excludes multiple files
test('multiple exclusions, excludes multiple files', () => {
  const exclusions = ['/path1/', '/path4/']
  const files = filterFiles([], exclusions, getFiles())
  expect(files.length).toBe(6)
});

//test single filter and single exclusion
test('single filter and single exclusion', () => {
  const filters = ['/added.txt/']
  const exclusions = ['/path4/']
  const files = filterFiles(filters, exclusions, getFiles())
  expect(files.length).toBe(3)
})

//test single filter and multiple exclusions
test('single filter and multiple exclusions', () => {
  const filters = ['/added.txt/']
  const exclusions = ['/path2/', '/path3/']
  const files = filterFiles(filters, exclusions, getFiles())
  expect(files.length).toBe(2)
})

//test multiple filters and single exclusion
test('multiple filters and single exclusion', () => {
  const filters = ['/path1/', '/path2/']
  const exclusions = ['/added.txt/']
  const files = filterFiles(filters, exclusions, getFiles())
  expect(files.length).toBe(1)
})

//test multiple filters and multiple exclusions
test('multiple filters and multiple exclusions', () => {
  const filters = ['/added.txt/', '/path2/']
  const exclusions = ['/path1/', '/path4/']
  const files = filterFiles(filters, exclusions, getFiles())
  expect(files.length).toBe(3)
})
