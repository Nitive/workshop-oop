import * as program from 'commander'
import { last, mapObjIndexed, toPairs } from 'ramda'


type SchemaOptionsShape = {
  [key: string]: {
    shortcut?: string,
    type: 'boolean' | 'string' | 'number',
    help?: string,
  },
}

interface Schema<Options> {
  target: string,
  options: Options,
}

// todo: program is probably singleton
// todo: return error message instead of throwing exception
export class ArgsParser<OptionsType> {
  constructor(private optionsSchema: SchemaOptionsShape) {}

  parse(args: string[]): Schema<OptionsType> {
    const prog = toPairs(this.optionsSchema)
      .reduce((p, [name, { shortcut, help, type } ]) => {
        const shortcutCommand = shortcut ? `-${shortcut}, ` : ''
        const valueOptions = {
          string: { placeholder: ' <n>', parser: undefined },
          number: { placeholder: ' <n>', parser: Number },
          boolean: { placeholder: '', parser: undefined, defaultValue: false },
        }[type]
        return p.option(
          `${shortcutCommand}--${name}${valueOptions.placeholder}`,
          help,
          valueOptions.parser,
          valueOptions.defaultValue,
        )
      }, program)
        .parse(args)

    const target = last(args)!

    return {
      target,
      options: mapObjIndexed((_value, key) => prog[key], this.optionsSchema) as any,
    }
  }
}
