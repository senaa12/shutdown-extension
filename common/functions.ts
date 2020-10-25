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
