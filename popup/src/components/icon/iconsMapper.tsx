import { IconEnum } from "./iconEnum";
import AlarmClock from '../../assets/icons/alarm-clock.svg';
import Arrow from '../../assets/icons/drop-down-arrow.svg';
import Cancel from '../../assets/icons/cancel.svg';
import Correct from '../../assets/icons/correct.svg';
import Countdown from '../../assets/icons/countdown.svg';
import Plus from '../../assets/icons/plus.svg';
import PowerButton from '../../assets/icons/power-button.svg';
import ScanNow from '../../assets/icons/scan.svg';
import Sports from '../../assets/icons/football.svg';
import VideoPlayer from '../../assets/icons/video-player.svg';

export const getIconSrc = (iconName: IconEnum) => {
    switch(iconName) {
        case IconEnum.AlarmClock: return AlarmClock;
        case IconEnum.Arrow: return Arrow;
        case IconEnum.Cancel: return Cancel;
        case IconEnum.Correct: return Correct;
        case IconEnum.Countdown: return Countdown;
        case IconEnum.Plus: return Plus;
        case IconEnum.PowerButton: return PowerButton;
        case IconEnum.ScanNow: return ScanNow;
        case IconEnum.Sports: return Sports;
        case IconEnum.VideoPlayer: return VideoPlayer;
        default: 
            const nullCheck: never = iconName;
            throw new Error(`not defined for ${iconName}`)
    }
}