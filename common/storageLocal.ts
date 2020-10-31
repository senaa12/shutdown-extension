export enum StorageLocalKeys {
    SelectedSports = 'LEAGUES',
}

/**
 * chrome.storage.local.set written without callback
 * @param key
 * @param dataToSave
 */
export const setStorageLocal = (key: StorageLocalKeys, dataToSave: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set({ [key]: JSON.stringify(dataToSave) }, () => {
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
export function getStorageLocal<T = any>(key: StorageLocalKeys): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(key, (items: Record<string, string>) => {
                const data = JSON.parse(items[key] ?? '{}') as T;

                resolve(data);
            });
        } catch (ex) {
            reject(ex);
        }
    });
}
