const shell = require('shelljs');
const path = require('path');

const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`);

const public = {}

public.waitForEmulator = () => {
    return new Promise((resolve, reject) =>{
        shell.exec(`${adb} wait-for-device`);
        const checkBootStatus = path.normalize(`${adb} shell getprop dev.bootcomplete`)
        if (shell.exec(checkBootStatus).stdout === '1') {
            resolve()
        } else {
            setTimeout(isReady, 1000, resolve)
        }
    })
}

function isReady(callback) {
    const checkBootStatus = path.normalize(`${adb} shell getprop dev.bootcomplete`)
    if (shell.exec(checkBootStatus).stdout.trim() === '1') {
        callback()
    } else {
        setTimeout(isReady, 1000, callback)
    }
}

module.exports = public