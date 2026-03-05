import path from 'node:path'

export function printNextSteps(projectName: string): void {
  const cdPath = path.relative(process.cwd(), path.resolve(projectName))
  const displayPath = cdPath.includes(' ') ? `"${cdPath}"` : cdPath

  console.log('')
  console.log('Project created successfully.')
  console.log('')
  console.log('Next steps:')
  console.log('')
  console.log(`  cd ${displayPath}`)
  console.log('  npm install')
  console.log('  npm run dev')
  console.log('')
}
