import { last, startsWith, dropLast, fromPairs } from 'ramda'

interface ParseResult<Options> {
  target: string,
  options: Options
}

function splitOptionsArgs(optionsArgs: string[]): string[][] {
  return optionsArgs.reduce((argsGroups, arg) => {
    if (startsWith('--', arg)) {
      return [...argsGroups, [arg]]
    } else {
      const lastArgsGroup = last(argsGroups) || []
      return [...dropLast(1, argsGroups), [...lastArgsGroup, arg]]
    }
  }, [])
}

function parseOptions(optionsArgs: string[]) {
  const optsPairs = splitOptionsArgs(optionsArgs)
      .map(([key, ...args]): [string, string] => [key.replace('--', ''), args.join(' ')])

  return fromPairs(optsPairs)
}

export class ArgsParser<Options> {
  parse(argv: string[]): ParseResult<Options> {
    const args = argv.slice(2)
    const lastArg = last(args)
    const target = (!lastArg || startsWith('--', lastArg)) ? undefined : lastArg
    const optionsArgs = target ? args.slice(0, -1) : args

    const options = parseOptions(optionsArgs)

    return {
      target: target!,
      options: options as any,
    }
  }
}
