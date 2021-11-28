import {expect, test} from '@oclif/test'

import cmd = require('../src')

describe('ms-teams-adaptive-notifications', () => {
  test
  .stderr()
  .do(() => cmd.run([]))
  .catch(error => {
    expect(error.message).to.contain('Missing 1 required arg:')
    expect(error.message).to.contain('webhookURL  Microsoft Teams Webhook URL')
    expect(error.message).to.contain('See more help with --help')
  })
  .it('requires WEBHOOKURL argument')
  test
  .stderr()
  .do(() => cmd.run(['https://www.webhhook.com']))
  .catch(error => {
    expect(error.message).to.contain('Missing required flag:')
    expect(error.message).to.contain('-t, --template TEMPLATE')
    expect(error.message).to.contain('See more help with --help')
  })
  .it('requires template flag')
  test
  .stderr()
  .do(() => cmd.run(['https://www.webhhook.com', '-t template']))
  .catch(error => {
    expect(error.message).to.contain('Missing required flag:')
    expect(error.message).to.contain('-c, --content CONTENT')
    expect(error.message).to.contain('See more help with --help')
  })
  .it('requires content flag')
  test
  .stderr()
  .do(() => cmd.run(['bad-webhook-url', '-t template', '-c flag']))
  .catch(error => {
    expect(error.message).to.contain('Webhook Endpoint provided is an invalid URL')
  })
  .it('Bad Webhook URL')
  //   test
  //   .stdout()
  //   .do(() => cmd.run([]))
  //   .catch('runs hello', ctx => {
  //     expect(ctx.message).to.equal('Missing 1 required arg')
  //   }).it()

//   test
//   .stdout()
//   .do(() => cmd.run(['--name', 'jeff']))
//   .it('runs hello --name jeff', ctx => {
//     expect(ctx.stdout).to.contain('hello jeff')
//   })
})
