import path from 'path';
import { ILoggerConfig } from "../../interfaces/ILoggerConfig";
import Logger from "../../util/Logger";

describe('Logger', () => {
    let logger: Logger;
    const testConfig: ILoggerConfig = {
        level: "debug",
        console: false,
        http: false,
        file: false,
        filePath: path.join(__dirname, './logs', `LOG-${new Date().toISOString().replace(/[:.]/g, '-')}.log`),
    };

    beforeAll(() => {
        logger = Logger.create(testConfig);
    });

    test('log messages at different levels', async () => {
        const spyDebug = jest.spyOn(logger, 'debug');
        const spyOnInfo = jest.spyOn(logger, 'info');
        const spyOnLog = jest.spyOn(logger, 'log');
        const spyOnWarn = jest.spyOn(logger, 'warn');
        const spyOnError = jest.spyOn(logger, 'error');
        const spyOnCritical = jest.spyOn(logger, 'critical');

        const obj = { test: 'test' };
        const err = new Error("Test error");

        await logger.debug('Debug message');
        expect(spyDebug).toHaveBeenCalledWith('Debug message');

        await logger.debug('Debug object:', obj);
        expect(spyDebug).toHaveBeenCalledWith('Debug object:', obj);

        await logger.info('Info message');
        expect(spyOnInfo).toHaveBeenCalledWith('Info message');

        await logger.info('Info object:', obj);
        expect(spyOnInfo).toHaveBeenCalledWith('Info object:', obj);

        await logger.log('Log message');
        expect(spyOnLog).toHaveBeenCalledWith('Log message');

        await logger.log('Log object:', obj);
        expect(spyOnLog).toHaveBeenCalledWith('Log object:', obj);

        await logger.warn('Warn message');
        expect(spyOnWarn).toHaveBeenCalledWith('Warn message');

        await logger.warn('Warn object:', obj);
        expect(spyOnWarn).toHaveBeenCalledWith('Warn object:', obj);

        await logger.error('Error message');
        expect(spyOnError).toHaveBeenCalledWith('Error message');

        await logger.error('Error object:', err);
        expect(spyOnError).toHaveBeenCalledWith('Error object:', err);

        await logger.critical('Critical message');
        expect(spyOnCritical).toHaveBeenCalledWith('Critical message');

        await logger.critical('Critical object:', obj);
        expect(spyOnCritical).toHaveBeenCalledWith('Critical object:', obj);

        await logger.critical('Critical message');
        expect(spyOnCritical).toHaveBeenCalledWith('Critical message');

        await logger.critical('Critical object:', err);
        expect(spyOnCritical).toHaveBeenCalledWith('Critical object:', err);

        spyDebug.mockRestore();
        spyOnInfo.mockRestore();
        spyOnLog.mockRestore();
        spyOnWarn.mockRestore();
        spyOnError.mockRestore();
        spyOnCritical.mockRestore();
    });
});
