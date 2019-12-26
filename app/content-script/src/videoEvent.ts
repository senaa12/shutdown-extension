const eventDetectionsOnVideo = (selectedTime: number) => {
    const videoTag = document.getElementsByTagName('video')[0];
    if (videoTag.currentTime + selectedTime > videoTag.duration) {
        alert('shudownb');
    }
};

export default eventDetectionsOnVideo;
