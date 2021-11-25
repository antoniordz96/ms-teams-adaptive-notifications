import { Command, flags } from '@oclif/command'
import { string } from '@oclif/parser/lib/flags'
import { Helper } from './helper'

class MsTeamsAdaptiveNotifications extends Command {
  static description = 'Send Microsoft Adaptive Cards using an Incoming Webhook.'
  static usage = "-t <adaptive-card-template> -c <adaptive-card-content> WEBHOOKURL"
  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    template: flags.string({
      char: 't',
      description: 'Adaptive Card Template - [URL/FILE_PATH]',
      env: 'ADAPTIVE_CARD_TEMPLATE',
      multiple: false,
      required: true
    }),
    content: flags.string({
      char: 'c',
      description: "Content to be inserted into Adaptive Card Template - [URL/FILE_PATH]",
      env: 'ADAPTIVE_CARD_CONTENT',
      required: true,
      multiple: false
    })
  }

  static args = [{
    name: 'webhookURL',
    required: true,
    description: 'Microsoft Teams Webhook URL',
    hidden: false,
  }]

  async run() {
    const { args, flags } = this.parse(MsTeamsAdaptiveNotifications)


    // Fetch Content from local/remote source
    let [template, values] = await Promise.all(
      [Helper.fetchContent(flags.template),
      Helper.fetchContent(flags.template)]);

    // Validate Content for Valid JSON
    Helper.validateJson(template)
    Helper.validateJson(values)
    this.log("Complete")
  }

}

export = MsTeamsAdaptiveNotifications
