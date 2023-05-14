import 'reflect-metadata';
import { testServerConfig } from './src/__tests_/testServerConfig';
import { ContainerWrapper } from './src/ioc_container/ContainerWrapper';

const containerWrapper = new ContainerWrapper(testServerConfig);
containerWrapper.initContainer();