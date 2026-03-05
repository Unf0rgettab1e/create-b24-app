import { resolve } from 'node:path'
import { defineCommand, runMain } from 'citty'
import * as prompts from '@clack/prompts'
import type { CLIOptions } from './types'
import { askQuestions } from './questions'
import { resolveTemplate, buildTemplateId } from './resolveTemplate'
import { printNextSteps } from './printNextSteps'

export function createCLI(opts: CLIOptions) {
  const main = defineCommand({
    meta: {
      name: opts.name,
      description: opts.description,
    },
    args: {
      dir: {
        type: 'positional',
        description: 'Project directory',
        required: false,
      },
    },
    async setup(context) {
      prompts.intro(opts.name)

      const dirFromArg = context.args.dir
        ? String(context.args.dir)
        : undefined

      const answers = await askQuestions(dirFromArg)
      const dir = resolve(answers.projectName)
      const starter = resolveTemplate(answers.platform, answers.distribution)
      const templateId = buildTemplateId(answers.platform, answers.distribution)

      prompts.log.info(`Template: ${templateId} → ${starter}`)
      prompts.log.step('Downloading template...')

      const { runCommand } = await import('@nuxt/cli')
      await runCommand('init', [
        dir,
        '-t',
        `gh:${opts.repo}/.starters/${starter}`,
      ])

      printNextSteps(answers.projectName)

      prompts.outro('Done.')
    },
  })

  return {
    runMain: () => runMain(main),
  }
}
