import {Command, flags} from '@oclif/command'
import {Helper} from './helper'

class MsTeamsAdaptiveNotifications extends Command {
  static description = 'Send Microsoft Adaptive Cards using an Incoming Webhook.'
  static usage = '-t <adaptive-card-template> -c <adaptive-card-content> WEBHOOKURL'
  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    template: flags.string({
      char: 't',
      description: 'Adaptive Card Template - [URL/FILE_PATH]',
      env: 'ADAPTIVE_CARD_TEMPLATE',
      multiple: false,
      required: true,
    }),
    content: flags.string({
      char: 'c',
      description: 'Content to be inserted into Adaptive Card Template - [URL/FILE_PATH]',
      env: 'ADAPTIVE_CARD_CONTENT',
      required: true,
      multiple: false,
    }),
  }

  static args = [{
    name: 'webhookURL',
    required: true,
    description: 'Microsoft Teams Webhook URL',
    hidden: false,
  }]

  async run() {
    const {args, flags} = this.parse(MsTeamsAdaptiveNotifications)

    if (Helper.isValidHttpUrl(args.webhookURL) === false) {
      this.error('Webhook Endpoint provided is an invalid URL', {
        code: 'INVALID_URL',
        suggestions: ['https://www.w3.org/TR/2011/WD-html5-20110525/urls.html#url'],
      })
    }

    // Fetch Content from local/remote source
    const [templatePayload, values] = await Promise.all(
      [Helper.fetchContent(flags.template),
        Helper.fetchContent(flags.content)])

    // JSON Validation and forward request
    await Helper.sendToMsWebhook(Helper.validateJson(templatePayload),
      Helper.validateJson(values),
      args.webhookURL).then(result =>
      this.log(`Notification Sent! Webhook Responded with a ${result}`))
  }
}

export = MsTeamsAdaptiveNotifications
