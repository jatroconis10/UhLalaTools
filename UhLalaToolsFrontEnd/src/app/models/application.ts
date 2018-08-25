export const APPLICATIONS: Application[] = [
  {id: 0, name: 'Aplicación #1', description: 'Test'},
  {id: 1, name: 'Aplicación #2', description: 'Test'},
  {id: 2, name: 'Aplicación #3', description: 'Test'},
];

export class Application {
  id?: number;
  name: string;
  description?: string;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
  }
}
