/* eslint-disable node/no-missing-import */
import {Helper} from '../src/helper'
import {expect} from '@oclif/test'
import {randomBytes} from 'node:crypto'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as nock from 'nock'
import {promises as fsPromises} from 'node:fs'

/**
 * Takes in a function and checks for error
 * @param {Function} method - The function to check
 * @param {any[]} params - The array of function parameters
 * @param {string} message - Optional message to match with error message
 * @returns Test Result
 */
const expectThrowsAsync = async (
  // eslint-disable-next-line @typescript-eslint/ban-types
  method: Function,
  params: any[],
  message?: string,
) => {
  let err = null
  try {
    await method(...params)
  } catch (error) {
    err = error
  }

  if (message) {
    if (err instanceof Error) {
      expect(err.message).to.be.equal(message)
    }
  } else {
    expect(err).to.be.an('Error')
  }
}

describe('fetchContent', function () {
  let templateData: string
  before(async function () {
    const template = 'test/data/activity-update-template.json'

    templateData = await fsPromises.readFile(path.resolve(template), {encoding: 'utf-8'})
  })
  context('Success', function () {
    it('Fetched from URL', async function () {
      nock('http://www.example.com').post('/example.json').reply(200, templateData)
      Helper.fetchContent('http://www.example.com/example.json').then(result =>
        expect(result).to.equal(templateData))
    })
  })
  context('Success', function () {
    it('Fetched from File', async function () {
      Helper.fetchContent(templateData).then(result =>
        expect(result).to.equal(templateData))
    })
  })
})

describe('sendToMsWebhook', function () {
  context('Success', function () {
    it('Template Sent', async function () {
      const template = 'test/data/activity-update-template.json'
      const data = 'test/data/activity-update-content.json'
      nock('http://www.example.com').post('/example.json').reply(200)
      const [t, d] = await Promise.all(
        [
          fsPromises.readFile(path.resolve(template), {encoding: 'utf-8'}),
          fsPromises.readFile(path.resolve(data), {encoding: 'utf-8'}),
        ],
      )
      const result = await Helper.sendToMsWebhook(JSON.parse(t), JSON.parse(d), 'http://www.example.com/example.json')
      expect(result).to.equal(200)
    })
  })
  context('Error', function () {
    it('Bad Request', async function () {
      const template = 'test/data/activity-update-template.json'
      const data = 'test/data/activity-update-content.json'
      nock('http://www.example.com').post('/example.json').reply(400)
      const [t, d] = await Promise.all(
        [
          fsPromises.readFile(path.resolve(template), {encoding: 'utf-8'}),
          fsPromises.readFile(path.resolve(data), {encoding: 'utf-8'}),
        ],
      )
      expectThrowsAsync(Helper.sendToMsWebhook,
        [JSON.parse(t), JSON.parse(d), 'http://www.example.com/example.json'],
        'Unable to send adaptiveCard Template to Webhook')
    })
  })
})

describe('fetchDataFromURL', function () {
  context('Remote Fetch', function () {
    it('Fetches file from remote source', async function () {
      const context = JSON.parse('{"hello":"world"}')
      nock('http://www.example.com').get('/example.json').reply(200, context)
      const result = await Helper.fetchDataFromURL('http://www.example.com/example.json')
      expect(result).to.deep.equal(context)
    })
  })
  context('Non 200 Response', function () {
    it('Attempts fetching file from remote source', async function () {
      const context = JSON.parse('{"hello":"world"}')
      nock('http://www.example.com').get('/example.json').reply(500, context)
      expectThrowsAsync(Helper.fetchDataFromURL, ['http://www.example.com/example.json'], 'Server Responded with invalid response.')
    })
  })
  context('Bad URL', function () {
    it('Fetches file from bad remote source', async function () {
      expectThrowsAsync(Helper.fetchDataFromURL, ['hello-world'], 'Request was made but no response was received')
    })
  })
})

describe('fetchDataFromDisk', function () {
  context('File exists', function () {
    it('Fetches file from local storage', function () {
      const content = 'test/data/activity-update-content.json'
      const data = fs.readFileSync(path.resolve(content), 'utf8')
      const result = Helper.fetchDataFromDisk(content)
      expect(data).to.deep.equal(result)
    })
  })
  context('File does not exist', function () {
    it('should throw error ', function () {
      const fakeFile = randomBytes(20).toString('hex') + '.txt'
      expect(() => Helper.fetchDataFromDisk(fakeFile)).to.throw(Error, 'extension does not end with .json')
    })
  })
})

describe('isValidHttpUrl', function () {
  context('https://google.com', function () {
    it('should return true', function () {
      expect(Helper.isValidHttpUrl('https://google.com')).to.equal(true)
    })
  })
  context('http://www.google.com', function () {
    it('should return true', function () {
      expect(Helper.isValidHttpUrl('http://www.google.com')).to.equal(true)
    })
  })
  context('hello-world', function () {
    it('should return false', function () {
      expect(Helper.isValidHttpUrl('hello-world')).to.equal(false)
    })
  })
  context('www.google.com', function () {
    it('should return false', function () {
      expect(Helper.isValidHttpUrl('www.google.com')).to.equal(false)
    })
  })
})

describe('validateJson', function () {
  context('validJsonString', function () {
    it('should return true', function () {
      const context = '{"hello":"world"}'
      expect(JSON.parse(context)).to.deep.equal(Helper.validateJson(context))
    })
  })
  context('validJsonObject', function () {
    it('should return true', function () {
      const context = JSON.parse('{"hello":"world"}')
      expect(context).to.deep.equal(Helper.validateJson(context))
    })
  })
  context('invalidJsonObject', function () {
    it('should throw error', function () {
      const context = 'Hello World'
      expect(() => Helper.validateJson(context)).to.throw(Error, 'Invalid JSON Content.')
    })
  })
})

