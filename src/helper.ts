/* eslint-disable node/no-missing-import */
import {debug} from 'node:console'
import axios from 'axios'
import * as fs from 'node:fs'
import * as path from 'node:path'
import {error as oclifError} from '@oclif/errors'
export const Helper = {

  async fetchContent(adaptiveCardLocation: string) {
    if (this.isValidHttpUrl(adaptiveCardLocation)) {
      return this.fetchDataFromURL(adaptiveCardLocation)
    }

    // this.fetchDataFromDisk(adaptiveCardLocation)
    return this.fetchDataFromDisk(adaptiveCardLocation)
  },

  isValidHttpUrl(input: string): boolean {
    let url
    try {
      url = new URL(input)
    } catch {
      return false
    }

    return url.protocol === 'https:' || url.protocol === 'https:'
  },

  async fetchDataFromURL(location: string) {
    try {
      const response = await axios({
        method: 'get',
        url: location,
      })

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        oclifError(
          'Server Responded with invalid response.',
          {
            code: error.response.status.toString(),
            ref: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
          },
        )
      } else if (axios.isAxiosError(error) && error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        oclifError(
          'Request was made but no response was received',
          {
            code: error.code,
            suggestions: [error.message],
          },
        )
      } else if (axios.isAxiosError(error) && error.message) {
        // Something happened in setting up the request that triggered an Error
        debug(error)
        oclifError(
          'Something happened in setting up the request that triggered an Error\n' + error.message,
        )
      } else {
        debug(error)
        oclifError('An Error occurred.')
      }
    }
  },

  fetchDataFromDisk(location: string) {
    try {
      const data = fs.readFileSync(path.resolve(location), {encoding: 'utf-8'})
      return data
    } catch (error) {
      const errorMessage = 'Failed to retrieve local file'
      if (error instanceof Error) {
        oclifError(error.message)
      }

      oclifError(errorMessage)
    }
  },

  validateJson(content: string | object) {
    try {
      const o = content && typeof content === 'object' ? content : JSON.parse(content)

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object",
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === 'object') {
        return o
      }
    } catch {
      oclifError('Invalid JSON Content.')
    }
  },
}
