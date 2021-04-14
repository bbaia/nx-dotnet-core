export interface NewGeneratorSchema {
  type: 'app' | 'lib';
  template: string;
  name: string;
  tags?: string;
  directory?: string;
  unitTestTemplate?: string;
}
