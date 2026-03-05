import type {
  DistributionType,
  PlatformType,
  StarterName,
  TemplateId,
  TemplateMapping,
} from './types'

const TEMPLATE_MAP: TemplateMapping[] = [
  { templateId: 'desktop-local', starter: 'starter' },
  { templateId: 'desktop-market', starter: 'dashboard' },
  { templateId: 'mobile-local', starter: 'starter' },
  { templateId: 'mobile-market', starter: 'dashboard' },
  { templateId: 'universal-local', starter: 'starter' },
  { templateId: 'universal-market', starter: 'dashboard' },
]

export function buildTemplateId(
  platform: PlatformType,
  distribution: DistributionType,
): TemplateId {
  return `${platform}-${distribution}` as TemplateId
}

export function resolveTemplate(
  platform: PlatformType,
  distribution: DistributionType,
): StarterName {
  const templateId = buildTemplateId(platform, distribution)

  const entry = TEMPLATE_MAP.find((m) => m.templateId === templateId)
  if (!entry) {
    throw new Error(`Unknown template identifier: ${templateId}`)
  }

  return entry.starter
}
