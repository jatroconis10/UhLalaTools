import { Test } from './test';
import { EndToEndTestCommand } from './end-to-end-test-command';

export const END_TO_END_TESTS: EndToEndTest[] = [
  {
    _id: '1',
    test: {
      _id: '1',
      appId: '1',
      name: 'Testea login exitoso',
      description: 'Ingresa a los estudiantes y realiza un login exitoso en la plataforma.',
    },
    generated: false,
    executed: false,
    commands: []
  },
  {
    _id: '2',
    test: {
      _id: '2',
      appId: '1',
      name: 'Testea signup exitoso',
      description: 'Ingresa a los estudiantes y realiza un signup exitoso en la plataforma.',
    },
    generated: false,
    executed: false,
    commands: []
  }
];

export class EndToEndTest {
  _id?: string;
  test: Test;
  generated: Boolean;
  executed: Boolean;
  commands: EndToEndTestCommand[];

  constructor(test: Test, commands?: EndToEndTestCommand[]) {
    this.test = test;
    this.generated = false;
    this.executed = false;
    if (commands) {
      this.commands = commands;
    } else {
      this.commands = [];
    }
  }
}
