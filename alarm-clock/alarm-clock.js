const clock = document.getElementById('clock');
const alarmTimeInput = document.getElementById('alarmTime');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const clearAlarmBtn = document.getElementById('clearAlarmBtn');
const alarmStatus = document.getElementById('alarmStatus');
const alarmSound = document.getElementById('alarmSound');

let alarmTime = null;
let alarmTimeout = null;

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${h}:${m}:${s}`;

    if (alarmTime && `${h}:${m}` === alarmTime) {
        triggerAlarm();
    }
}

function setAlarm() {
    if (!alarmTimeInput.value) {
        alarmStatus.textContent = "Please select a time for the alarm.";
        return;
    }
    alarmTime = alarmTimeInput.value;
    alarmStatus.textContent = `Alarm set for ${alarmTime}`;
}

function clearAlarm() {
    alarmTime = null;
    alarmStatus.textContent = "Alarm cleared.";
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

function triggerAlarm() {
    alarmStatus.textContent = "⏰ Alarm ringing!";
    alarmSound.play();
    // Prevent multiple triggers in the same minute
    alarmTime = null;
}

setAlarmBtn.addEventListener('click', setAlarm);
clearAlarmBtn.addEventListener('click', clearAlarm);

setInterval(updateClock, 1000);
updateClock();