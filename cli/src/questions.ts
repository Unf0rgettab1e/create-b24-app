import * as prompts from '@clack/prompts'
import type { DistributionType, PlatformType, UserAnswers } from './types'

const DEFAULT_PROJECT_NAME = 'b24-app'

function formatTargetDir(dir: string): string {
  return dir
    .trim()
    .replace(/[<>:"\\|?*]/g, '')
    .replace(/\/+$/g, '')
}

export async function askProjectName(): Promise<string> {
  const name = await prompts.text({
    message: 'Project name:',
    placeholder: DEFAULT_PROJECT_NAME,
    defaultValue: DEFAULT_PROJECT_NAME,
    validate(value) {
      if (!value || formatTargetDir(value).length === 0) {
        return 'Project name is required'
      }
    },
  })

  if (prompts.isCancel(name)) {
    prompts.cancel('Operation cancelled.')
    process.exit(0)
  }

  return formatTargetDir(name)
}

export async function askDistribution(): Promise<DistributionType> {
  const distribution = await prompts.select({
    message: 'Application distribution type:',
    options: [
      { value: 'local' as const, label: 'Local application' },
      { value: 'market' as const, label: 'Marketplace application' },
    ],
  })

  if (prompts.isCancel(distribution)) {
    prompts.cancel('Operation cancelled.')
    process.exit(0)
  }

  return distribution as DistributionType
}

export async function askPlatform(): Promise<PlatformType> {
  const platform = await prompts.select({
    message: 'Target platform:',
    options: [
      { value: 'desktop' as const, label: 'Desktop only' },
      { value: 'mobile' as const, label: 'Bitrix Mobile' },
      { value: 'universal' as const, label: 'Desktop + Mobile' },
    ],
  })

  if (prompts.isCancel(platform)) {
    prompts.cancel('Operation cancelled.')
    process.exit(0)
  }

  return platform as PlatformType
}

export async function askQuestions(dirFromArg?: string): Promise<UserAnswers> {
  const projectName = dirFromArg ?? (await askProjectName())
  const distribution = await askDistribution()
  const platform = await askPlatform()

  return { projectName, distribution, platform }
}
