# ms-teams-adaptive-notifications

**CLI used to send Microsoft Adaptive Cards using an Incoming Webhook.**

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ms-teams-adaptive-notifications.svg)](https://npmjs.org/package/ms-teams-adaptive-notifications)
[![codecov](https://codecov.io/gh/antoniordz96/ms-teams-adaptive-notifications/branch/main/graph/badge.svg?token=8Q5QA84ORD)](https://codecov.io/gh/antoniordz96/ms-teams-adaptive-notifications)
[![Downloads/week](https://img.shields.io/npm/dw/ms-teams-adaptive-notifications.svg)](https://npmjs.org/package/ms-teams-adaptive-notifications)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

[Microsoft](https://wwww.docs.microsoft.com) provides [Adaptive Cards](https://docs.microsoft.com/en-us/adaptive-cards/) which are an open card exchange format enabling developers to exchange UI content in a common and consistent way.

There may be times or uses cases that one would like to send a customizable message to a teams channel to notify of an event (ex: Tekton Pipeline Completion Run, Release Cut, etc...).

This NPM CLI allows users to send customizable notifications to a Microsoft Teams via an incoming webhook.

The adaptive card schema and payload to templatize card can be stored locally or fetched remotely.

This CLI leverages Microsoft's [Adaptive Card Templating SDKs](https://docs.microsoft.com/en-us/adaptive-cards/templating/sdk).

## Prerequisites

- Build and Design your adaptive card using [Microsoft's Adaptive Card Designer](https://adaptivecards.io/designer/)
  - Don't forget to export your adaptive card payload and sample data :smile:

- Create [Microsoft Teams Incoming Webhook](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)

## Usage

```sh-session
$ npm install -g ms-teams-adaptive-notifications

$ ms-notify (-v|--version|version)
ms-teams-adaptive-notifications/1.0.0 linux-x64 node-v16.13.0

$ ms-notify --help
Send Microsoft Adaptive Cards using an Incoming Webhook.

USAGE
  $ ms-notify -t <adaptive-card-template> -c <adaptive-card-content> WEBHOOKURL

ARGUMENTS
  WEBHOOKURL  Microsoft Teams Webhook URL

OPTIONS
  -c, --content=content    (required) Content to be inserted into Adaptive Card Template - [URL/FILE_PATH]
  -h, --help               show CLI help
  -t, --template=template  (required) Adaptive Card Template - [URL/FILE_PATH]
  -v, --version            show CLI version
```

## Usage via Docker

```sh-session
# Pull Image from DockerHub
docker pull antoniordz/ms-notify@latest

# View Help Information
dock run --rm ms-notify --help

# Basic Usage
docker run --rm ms-notify -t <adaptive-card-template> -c <adaptive-card-content> WEBHOOKURL
```

## Alternatives

- [Adaptive Cards Template Service
](https://docs.microsoft.com/en-us/adaptive-cards/templating/service)
- [Tekton - Send message to Microsoft Teams Channel](https://artifacthub.io/packages/tekton-task/tekton-catalog-tasks/send-to-microsoft-teams)
  - Only supports plain test message
