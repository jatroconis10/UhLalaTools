const shell = require('shelljs');
const path = require('path');

const emulator = path.normalize(`${process.env.ANDROID_HOME}/emulator/emulator`);
const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`);

const state = {
    maxInstances: 2,
    runningAvds: [],
}

const public = {}

public.setMaxInstances = (newMax) => {
    state.maxInstances = newMax
}

public.runEmulator = (avd) => {

    const result = {
        error: undefined,
        serial: undefined
    }

    if(state.runningAvds.filter(avd => avd !== undefined).length >= state.maxInstances) {
        result.error = "Can't launch more emulators"
    }

    const i = getAvailableIndex(avd);
    if(i === -1) {
        result.error = 'AVD already running'
    }

    if(!result.error) {
        state.runningAvds[i] = avd
        const port = 5554 + i*2
        result.serial = `emulator-${port}`
        shell.exec(`${emulator} -avd ${avd} -no-window`, (code, stdout, stderr) => {
            state.runningAvds[i] = undefined;
        })
    }
    console.log('Returning from run emulator')
    return result
}

public.stopEmulator = (avd) => {

    const result = {
        error: undefined,
        serial: undefined
    }

    const i = findAvdIndex(avd);
    if (i === -1) {
        result.error = 'Avd not running'
    } else {
        const port = 5554 + i*2
        const serial = `emulator-${port}`
        shell.exec(`${adb} -s ${serial} emu kill`);
        result.serial = serial;
        state.runningAvds[i] = undefined
    }
    return result;
}

function findAvdIndex(avd) {
    for (let i = 0; i < state.runningAvds.length; i++) {
        const avdAct = state.runningAvds[i];
        if(avdAct === avd) return i;
    }
    return -1;
}

function getAvailableIndex(newAvd) {
    let free = -1
    for (let i = 0; i < state.runningAvds.length && free === -1; i++) {
        const avd = state.runningAvds[i];
        if (avd === newAvd) return -1;
        if(!avd) free = i
    }
    if (free === -1) return state.runningAvds.length
    else return free
}

module.exports = public