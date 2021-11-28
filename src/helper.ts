/* eslint-disable node/no-missing-import */
import {debug} from 'node:console'
import axios from 'axios'
import * as fs from 'node:fs'
import * as path from 'node:path'
import {error as oclifError} from '@oclif/errors'
import * as ACData from 'adaptivecards-templating'
import * as AdaptiveCards from 'adaptivecards'

export const Helper = {

  async fetchContent(adaptiveCardLocation: string) {
    if (this.isValidHttpUrl(adaptiveCardLocation)) {
      return this.fetchDataFromURL(adaptiveCardLocation)
    }

    // this.fetchDataFromDisk(adaptiveCardLocation)
    return this.fetchDataFromDisk(adaptiveCardLocation)
  },

  async sendToMsWebhook(template: JSON, content: JSON, webhookUrl: string) {
    const temp = new ACData.Template(template)

    const expandedTemplate = temp.expand({
      $root: content,
    })

    const adaptiveCard = new AdaptiveCards.AdaptiveCard()

    adaptiveCard.parse(expandedTemplate)
    const message = {
      type: 'message',
      attachments: [{
        contentType: 'application/vnd.microsoft.card.adaptive',
        contentUrl: null,
        content: adaptiveCard.toJSON(),
      }],
    }
    try {
      const response = await axios({
        method: 'post',
        url: webhookUrl,
        data: message,
      })
      return response.status
    } catch (error)  {
      debug(error)
      oclifError('Unable to send adaptiveCard Template to Webhook')
    }
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
      const extension = path.extname(location)
      if (extension !== '.json') {
        throw new Error(`File ${location} extension does not end with .json`)
      }

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

  isValidHttpUrl(input: string): boolean {
    let url
    try {
      url = new URL(input)
    } catch {
      return false
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
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
