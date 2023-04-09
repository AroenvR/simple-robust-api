import { TaskProcessor } from '../../util/TaskProcessor';

describe('TaskProcessor', () => {
    let taskProcessor: TaskProcessor;

    beforeEach(() => {
        taskProcessor = new TaskProcessor(10); // Set a small interval for testing purposes
    });

    afterEach(async () => {
        await taskProcessor.stop();
    });

    test('enqueue and process tasks', async () => {
        const task1 = jest.fn();
        const task2 = jest.fn();

        await taskProcessor.enqueueTask(task1);
        await taskProcessor.enqueueTask(task2);

        expect((await taskProcessor.getTaskQueue()).length).toBe(2);

        await taskProcessor.start();

        // Wait for the tasks to be processed
        await new Promise((resolve) => setTimeout(resolve, 50));

        expect(task1).toHaveBeenCalled();
        expect(task2).toHaveBeenCalled();
        expect((await taskProcessor.getTaskQueue()).length).toBe(0);
    });
});
