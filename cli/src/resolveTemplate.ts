import type {
  DistributionType,
  PlatformType,
  StarterName,
  TemplateId,
} from './types'

const TEMPLATE_MAP: Record<TemplateId, StarterName> = {
  'desktop-local': 'starter',
  'desktop-market': 'dashboard',
  'mobile-local': 'starter',
  'mobile-market': 'dashboard',
  'universal-local': 'starter',
  'universal-market': 'dashboard',
}

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

  const starter = TEMPLATE_MAP[templateId]
  if (!starter) {
    throw new Error(`Unknown template identifier: ${templateId}`)
  }

  return starter
}
