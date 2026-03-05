declare module '@nuxt/cli' {
  export function runCommand(
    command: string,
    args: string[],
  ): Promise<void>
}
