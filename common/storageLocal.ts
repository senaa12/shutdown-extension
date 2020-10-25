export enum StorageLocalKeysEnum {
    SportsApiToken = 'sportsApiToken',
}

/**
 * chrome.storage.local.set written without callback
 * @param key
 * @param dataToSave
 */
export const setStorageLocal = (key: StorageLocalKeysEnum, data: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set({ [key]: JSON.stringify(data) }, () => {
                console.log(`Data saved to local storage with key: ${key}`);

                resolve(true);
            });
        } catch (ex) {
            reject(ex);
        }

    });
};

/**
 * chrome.storage.local.get written without a promise
 * @param key
 */
export function getStorageLocal<T = any>(key: StorageLocalKeysEnum): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, (items: Record<string, string>) => {
                const data = JSON.parse(items[key] ?? '{}') as T;

                // checks if object is empty
                if (!Object.keys(data).length) {
                    console.warn(`Record with key: ${key} does not exist`);

                    resolve(undefined);
                } else {
                    resolve(data);
                }
            });
        } catch (ex) {
            reject(ex);
        }
    });
}
