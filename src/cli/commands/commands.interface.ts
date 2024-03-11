/* eslint-disable node/no-unsupported-features/es-syntax */
export interface Command {
  getName(): string;
  execute(...params: string[]): void;
}
