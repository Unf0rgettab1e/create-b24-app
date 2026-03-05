import { createCLI } from './cli'

const cli = createCLI({
  name: 'create-b24-app',
  description: 'Create a new Bitrix24 application',
  repo: 'Unf0rgettab1e/create-b24-app',
})

cli.runMain()
