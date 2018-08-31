export const COMMAND_LIST: string[] = ['goTo', 'click', 'keys', 'selectByText', 'waitVisible', 'assertExists', 'assertTextMatches'];

export class EndToEndTestCommand {
  selector: string;
  type: string;
  value?: any;

  constructor(selector: string, type: string) {
    this.selector = selector;
    this.type = type;
  }

  requiresValue(): boolean {
    return ['keys', 'waitVisible', 'assertTextMatches'].includes(this.type);
  }
}
