export class Application {
  _id?: string;
  name: string;
  platform: string;
  maxInstances: number;
  browsers?: string[];
  url?: string;
  apkPackage?: string;
  apkUploaded: boolean;
  description?: string;

  constructor(name: string, platform: string, maxInstances: number = 1,
              browsers?: string[], url?: string, apkPackage?: string, description?: string) {
    this.apkUploaded = false;
    this.name = name;
    this.description = description;
    this.maxInstances = maxInstances;
    if (platform === 'web') {
      browsers = browsers || ['chrome'];
      this.browsers = browsers;
      this.url = url;
    } else {
      this.apkPackage = apkPackage;
    }
  }
}
