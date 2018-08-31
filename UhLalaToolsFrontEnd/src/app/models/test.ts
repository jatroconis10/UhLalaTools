export class Test {
  _id?: string;
  appId?: string;
  name: string;
  description?: string;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
  }
}
