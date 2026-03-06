export interface CLIOptions {
  name: string
  description: string
  repo: string
}

export type DistributionType = 'local' | 'market'

export type PlatformType = 'desktop' | 'mobile' | 'universal'

export type TemplateId =
  | 'desktop-local'
  | 'desktop-market'
  | 'mobile-local'
  | 'mobile-market'
  | 'universal-local'
  | 'universal-market'

export type StarterName = 'starter' | 'dashboard'

export interface UserAnswers {
  projectName: string
  distribution: DistributionType
  platform: PlatformType
}
