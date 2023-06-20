import { configService, Log } from './env.config';
import dayjs from 'dayjs';

const formatDateLog = (timestamp: number) =>
  dayjs(timestamp)
    .toDate()
    .toString()
    .replace(/\sGMT.+/, '');

enum Color {
  LOG = '\x1b[32m',
  INFO = '\x1b[34m',
  WARN = '\x1b[33m',
  ERROR = '\x1b[31m',
  DEBUG = '\x1b[36m',
  VERBOSE = '\x1b[37m',
  DARK = '\x1b[30m',
}

enum Command {
  RESET = '\x1b[0m',
  BRIGHT = '\x1b[1m',
  UNDERSCORE = '\x1b[4m',
}

enum Level {
  LOG = Color.LOG + '%s' + Command.RESET,
  DARK = Color.DARK + '%s' + Command.RESET,
  INFO = Color.INFO + '%s' + Command.RESET,
  WARN = Color.WARN + '%s' + Command.RESET,
  ERROR = Color.ERROR + '%s' + Command.RESET,
  DEBUG = Color.DEBUG + '%s' + Command.RESET,
  VERBOSE = Color.VERBOSE + '%s' + Command.RESET,
}

enum Type {
  LOG = 'LOG',
  WARN = 'WARN',
  INFO = 'INFO',
  DARK = 'DARK',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  VERBOSE = 'VERBOSE',
}

enum Background {
  LOG = '\x1b[42m',
  INFO = '\x1b[44m',
  WARN = '\x1b[43m',
  DARK = '\x1b[40m',
  ERROR = '\x1b[41m',
  DEBUG = '\x1b[46m',
  VERBOSE = '\x1b[47m',
}

export class Logger {
  private readonly configService = configService;
  constructor(private context = 'Logger') {}

  public setContext(value: string) {
    this.context = value;
  }

  private console(value: any, type: Type) {
    const types: Type[] = [];

    this.configService.get<Log>('LOG').LEVEL.forEach((level) => types.push(Type[level]));

    const typeValue = typeof value;

    if (types.includes(type)) {
      if (configService.get<Log>('LOG').COLOR) {
        console.log(
          /*Command.UNDERSCORE +*/ Command.BRIGHT + Level[type],
          '[CodeChat]',
          Command.BRIGHT + Color[type],
          process.pid.toString(),
          Command.RESET,
          Command.BRIGHT + Color[type],
          '-',
          Command.BRIGHT + Color.VERBOSE,
          `${formatDateLog(Date.now())}  `,
          Command.RESET,
          Color[type] + Background[type] + Command.BRIGHT,
          `${type} ` + Command.RESET,
          Color.WARN + Command.BRIGHT,
          `[${this.context}]` + Command.RESET,
          Color[type] + Command.BRIGHT,
          `[${typeValue}]` + Command.RESET,
          Color[type],
          typeValue !== 'object' ? value : '',
          Command.RESET,
        );
        typeValue === 'object' ? console.log(/*Level.DARK,*/ value, '\n') : '';
      } else {
        console.log(
          '[CodeChat]',
          process.pid.toString(),
          '-',
          `${formatDateLog(Date.now())}  `,
          `${type} `,
          `[${this.context}]`,
          `[${typeValue}]`,
          value,
        );
      }
    }
  }

  public log(value: any) {
    this.console(value, Type.LOG);
  }

  public info(value: any) {
    this.console(value, Type.INFO);
  }

  public warn(value: any) {
    this.console(value, Type.WARN);
  }

  public error(value: any) {
    this.console(value, Type.ERROR);
  }

  public verbose(value: any) {
    this.console(value, Type.VERBOSE);
  }

  public debug(value: any) {
    this.console(value, Type.DEBUG);
  }

  public dark(value: any) {
    this.console(value, Type.DARK);
  }
}
