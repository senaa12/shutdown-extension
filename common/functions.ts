import { SportApiMatchModel } from './sportApiModels';

export const calculateSeconds = (selectedTime: string) => {
    const values =  selectedTime.split(':');
    let numberOfSeconds = 0;
    numberOfSeconds += parseInt(values[0]) * 60 * 60;
    numberOfSeconds += parseInt(values[1]) * 60;
    numberOfSeconds += values[2] ? parseInt(values[2]) : 0;
    return numberOfSeconds;
};

export const getSelectedTimeLabel = (selectedTime: string) => {
    const values = selectedTime.split(':').map((x) => ( parseInt(x) ));
    let timeLabel = '';
    timeLabel += values[0] > 0
        ? values[0] > 1 ? `${values[0]} hours ` : `${values[0]} hour `
        : '';
    timeLabel += values[1] > 0
        ? values[1] > 1 ? `${values[1]} minutes ` : `${values[1]} minute `
        : '';
    timeLabel += (timeLabel !== '' && values[2]) ? 'and ' : '';
    timeLabel += values[2] > 0
        ? values[2] > 1 ? `${values[2]} seconds ` : `${values[2]} second `
        : '';
    return timeLabel;
};

export const convertSecondsToTimeFormat = (totalSeconds?: number, fullTime: boolean = false) => {
    if (!totalSeconds) {
        return undefined;
    }

    const hours   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = Math.trunc(totalSeconds - (hours * 3600) - (minutes * 60));

    const hoursString = hours < 10 ? '0' + hours.toString() : hours.toString();
    const minutesString = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
    const secondsString = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

    if (hours > 0 || fullTime) {
        return hoursString + ':' + minutesString + ':' + secondsString;
    } else if (minutes > 0) {
        return minutesString + ':' + secondsString;
    } else {
        return secondsString;
    }
};

export const formatDate = (d: Date) => {
    const date = new Date(d);
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
};

export const getMatchLabelFromMatchModel = (match: SportApiMatchModel) => (
    `${match.homeTeam} : ${match.awayTeam}`
);

export const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue,
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

/** same as Equal function but for arrays, expensive operation */
export function arrayDeepEqual<T extends {}>(object1: Array<T>, object2: Array<T>, byKey?: Array<keyof T>) {
    const compare = (obj1: T, obj2: T) => {
        const compareFunc = (a: T, b: T, keys: Array<keyof T>, iterator: number) => {
            if (a[keys[iterator]] < b[keys[iterator]]) {
                return -1;
            }

            if (a[keys[iterator]] > b[keys[iterator]]) {
                return 1;
            }

            if (keys.length <= 1 + iterator) {
                return 0;
            } else {
                const newIterator = iterator + 1;
                return compareFunc(a, b, keys, newIterator);
            }
        };

        return compareFunc(obj1, obj2, byKey !== undefined ? byKey : Object.keys(obj1) as any, 0);
    };

    if (object2.length === 0 && object1.length === 0) {
        return true;
    }

    if (object2.length !== object1.length) {
        return false;
    }

    if (JSON.stringify(Object.keys(object1[0]).sort()) !== JSON.stringify(Object.keys(object2[0]).sort())) {
        return false;
    }

    const compareKeys = byKey !== undefined ? byKey : Object.keys(object2[0]) as any;
    const sortedObj1 = object1.sort(compare);
    const sortedObj2 = object2.sort(compare);

    for (let i = 0; i < sortedObj2.length; i++) {
        if (!deepEqual(sortedObj1[i], sortedObj2[i], compareKeys)) {
            return false;
        }
    }
    return true;
}

export function deepEqual<T extends {}>(object1: T, object2: T, byKey?: Array<keyof T>) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    const compareKeys = byKey !== undefined
        ? byKey
        : keys1;
    for (const key of compareKeys) {
      const val1 = object1[key as any];
      const val2 = object2[key as any];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2, byKey) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }

    return true;
}

export function isObject(object) {
    return object != null && typeof object === 'object';
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms) );
}
