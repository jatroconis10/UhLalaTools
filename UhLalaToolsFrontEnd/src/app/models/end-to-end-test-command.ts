export const COMMAND_TYPES: string[] = ['goTo', 'click', 'keys', 'selectByText', 'waitVisible', 'assertExists', 'assertTextMatches'];

export const COMMAND_TYPES_VALUE_REQUIRED = {
  'keys': {
    valueType: 'text',
    required: true
  },
  'selectByText': {
    valueType: 'text',
    required: true
  },
  'waitVisible': {
    valueType: 'number',
    required: false
  },
  'assertTextMatches': {
    valueType: 'text',
    required: true
  }
};

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
