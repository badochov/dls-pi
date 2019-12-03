const serialPort = require('serialport');


class Arduino {
    data = "I00000@0";
    prevData = "I00000@0";
    port;

    static get states() {
        return {
            "unready": 0,
            "ready": 1,
            "solving": 2,
            "solved": 3
        }
    }

    constructor(port) {
        this.port = port;
        this.port.on("data", this.onData.bind(this))
    }


    convertTime(raw) {
        const rawTime = this.timePart(this.data);
        return rawTime;
    }

    timePart(data) {
        return data.slice(1, 6);
    }

    statePart(data) {
        return data[0];
    }

    get time() {
        return this.convertTime(this.data);
    }

    get state() {
        const states = Arduino.states;
        const currState = this.statePart(this.data);

        if (currState == "A")
            return states.ready;
        const currTime = this.timePart(this.data);
        const prevTime = this.timePart(this.prevData);

        if (currTime != prevTime)
            return states.solving;
        if (currTime == "00000")
            return states.unready;
        return states.solved;
    }

    static get BAUDRATE() {
        return 19200;
    }

    onData(data) {
        const dataString = data.toString();
        console.log(dataString);
        if (this.isCorrect(dataString))
            this.prevData = this.data;
        this.data = dataString;
    }

    isCorrect(raw) {
        if (raw.length == 10) {
            const checkSum = raw[6];
            const digits = raw.slice(1, 6).split("");
            const sum = 64 + digits.reduce((currSum, digit) => currSum + parseInt(digit), 0);
            if (String.fromCharCode(sum) == checkSum) {
                return true;
            }
        }
        return false;
    }

    static async getArduinos() {
        try {
            const ports = await serialPort.list();

            let arduinos = [];
            for (const port of ports) {
                const pnpId = port.pnpId ? port.pnpId : "";

                if (pnpId.match(/USB2\.0-Serial/) || pnpId.match(/ttyACM0/)) {
                    console.log(port);
                    const arduinoPort = new serialPort(port.path, {baudRate: Arduino.BAUDRATE});
                    const arduino = new Arduino(arduinoPort);
                    arduinos.push(arduino)
                }
            }
            return arduinos;

        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = Arduino
