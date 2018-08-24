export const APPLICATIONS: Application[] = [
  {name: 'Aplicación #1', description: 'Test'},
  {name: 'Aplicación #2', description: 'Test'},
  {name: 'Aplicación #3', description: 'Test'},
  {name: 'Aplicación #1', description: 'Test'},
  {name: 'Aplicación #2', description: 'Test'},
  {name: 'Aplicación #3', description: 'Test'},
  {name: 'Aplicación #1', description: 'Test'},
  {name: 'Aplicación #2', description: 'Test'},
  {name: 'Aplicación #3', description: 'Test'},
  {name: 'Aplicación #1', description: 'Test'},
  {name: 'Aplicación #2', description: 'Test'},
  {name: 'Aplicación #3', description: 'Test'}
];

export class Application {
  name: string;
  description?: string;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
  }
}
