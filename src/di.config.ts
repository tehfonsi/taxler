import { Container } from 'inversify';
import ConfigHelper, { Config } from './common/config';

let container: Container;

export const initDI = (path: string = '.') => {
  const config = ConfigHelper.get(path);

  container = new Container();

  container.bind<string>('Path').toConstantValue(path);
  container.bind<Config>('Config').toConstantValue(config);
};

export const DI = () => {
  return container;
};
