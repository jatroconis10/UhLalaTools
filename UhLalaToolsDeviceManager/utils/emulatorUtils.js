const shell = require('shelljs');
const path = require('path');

const emulator = path.normalize(`${process.env.ANDROID_HOME}/emulator/emulator`);
const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`);

const public = {}

public.runEmulator = (avd) => {
    shell.exec(`${emulator} -avd ${avd}`, {async: true})
}

public.stopEmulator = () => {
    shell.exec(`${adb} emu kill`);
}

module.exports = public