export const calculateSeconds = (selectedTime: string) => {
    const values =  selectedTime.split(':');
    let numberOfSeconds = 0;
    numberOfSeconds += parseInt(values[0]) * 60 * 60;
    numberOfSeconds += parseInt(values[1]) * 60;
    numberOfSeconds += values[2] ? parseInt(values[2]) : 0;
    return numberOfSeconds;
};

export const convertSecondsToTimeFormat = (totalSeconds?: number) => {
    if (!totalSeconds) {
        return null;
    }

    const hours   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    let hoursString, minutesString, secondsString;
    if (hours   < 10) {hoursString   = '0' + hours.toString(); }
    if (minutes < 10) {minutesString = '0' + minutes.toString(); }
    if (seconds < 10) {secondsString = '0' + seconds.toString(); }

    if (hours > 0) {
        return hoursString + ':' + minutesString + ':' + secondsString;
    } else if (minutes > 0) {
        return minutesString + ':' + secondsString;
    } else {
        return secondsString;
    }
};
