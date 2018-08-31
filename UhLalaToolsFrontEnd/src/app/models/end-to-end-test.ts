import { Test } from './test';

export const END_TO_END_TESTS: EndToEndTest[] = [
  {
    _id: '1',
    test: {
      _id: '1',
      appId: '1',
      name: 'Testea login exitoso',
      description: 'Ingresa a los estudiantes y realiza un login exitoso en la plataforma.'
    }
  },
  {
    _id: '2',
    test: {
      _id: '2',
      appId: '1',
      name: 'Testea signup exitoso',
      description: 'Ingresa a los estudiantes y realiza un signup exitoso en la plataforma.'
    }
  }
];

export class EndToEndTest {
  _id?: string;
  test: Test;

  constructor(test: Test) {
    this.test = test;
  }
}
