export type Task = () => void;

/**
 * The TaskProcessor class is responsible for managing a queue of tasks,
 * enqueuing tasks, and processing them asynchronously at specified intervals.
 */
export class TaskProcessor {
    private taskQueue: Task[] = [];
    private processingInterval: number;
    private processingTimer: NodeJS.Timeout | null = null;

    /**
     * Constructs a TaskProcessor instance with a specified processing interval.
     * @param {number} processingInterval - The interval between processing tasks in milliseconds.
     */
    constructor(processingInterval: number = 1000) {
        this.processingInterval = processingInterval;
    }

    /**
     * Enqueues a task to the task queue.
     * @param {Task} task - The task to enqueue.
     * @returns {Promise<void>}
     */
    public async enqueueTask(task: Task): Promise<void> {
        this.taskQueue.push(task);
    }

    /**
     * Retrieves the current task queue.
     * @returns {Promise<Task[]>} - The task queue as an array of Tasks.
     */
    public async getTaskQueue(): Promise<Task[]> {
        return this.taskQueue;
    }

    /**
     * Empties the task queue.
     * @returns {Promise<void>}
     */
    public async emptyTaskQueue(): Promise<void> {
        this.taskQueue.length = 0;
    }

    /**
     * Processes the next task in the task queue if available.
     * @returns {Promise<void>}
     */
    private async processTask(): Promise<void> {
        if (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift();
            if (task) {
                task();
            }
        }
    }

    /**
     * Processes the next task and schedules the subsequent task processing.
     * @returns {Promise<void>}
     */
    private async processNextTask(): Promise<void> {
        await this.processTask();
        this.processingTimer = setTimeout(() => {
            this.processNextTask();
        }, this.processingInterval);
    }

    /**
     * Starts the task processing loop.
     * @returns {Promise<void>}
     */
    public async start(): Promise<void> {
        if (this.processingTimer === null) {
            this.processNextTask();
        }
    }

    /**
     * Stops the task processing loop.
     * @returns {Promise<void>}
     */
    public async stop(): Promise<void> {
        if (this.processingTimer !== null) {
            clearTimeout(this.processingTimer);
            this.processingTimer = null;
        }
    }
}
