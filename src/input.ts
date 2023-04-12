import * as core from '@actions/core'
import type {Format} from './types'
import isGLob from 'is-glob'
import globRegex from 'glob-regex'
import {InputOptions} from '@actions/core'

interface Inputs {
  format: Format
  token: string
  filters: string[]
  exclusions: string[]
}

export function getInputs(): Inputs {
  //github token
  const token = core.getInput('token', {required: true})

  //output format
  const format = core.getInput('format', {required: true}) as Format

  // Ensure that the format parameter is set properly.
  if (format !== 'space-delimited' && format !== 'csv' && format !== 'json') {
    throw new Error(
      `Format must be one of 'string-delimited', 'csv', or 'json', got '${format}'.`
    )
  }

  const mapFilterStringToRegex = (
    input: string,
    options: InputOptions
  ): string[] => {
    return core.getMultilineInput(input, options).map((filter: string) => {
      // If filter is a regexp return it
      if (filter.startsWith('/') && filter.endsWith('/')) {
        return filter
      }
      // if filter is a glob convert to regexp
      if (isGLob(filter)) {
        return globRegex.replace(filter)
      }

      throw new Error(
        `Path filter must be a glob or a regexp, got '${filter}'.`
      )
    })
  }

  //path filters
  const filters = mapFilterStringToRegex('path-filters', {
    required: false
  })

  //path exclusions
  const exclusions = mapFilterStringToRegex('path-exclusions', {
    required: false
  })

  return {token, format, filters, exclusions}
}
