import { isTruthy } from "./isTruthy";
import Logger from "./logging/Logger";

export const allSettledWrapper = async <T>(promises: Promise<T>[]) => {
    const rejections: PromiseRejectedResult[] = [];

    await Promise.allSettled(promises).then((results) => {
        results.forEach((result) => {
            if (result.status === 'rejected') {
                rejections.push(result);
            }
        });
    });

    if (isTruthy(rejections)) {
        const errors = rejections.map((p) => p.reason);

        Logger.instance.error(`allSettledWrapper failed for the following reasons: ${errors.join(", ")}`);
        throw new Error(`Rejected promise's reasons: ${errors.join(", ")}`);
    }

    return promises;
};