const serialPort = require('serialport');

export class Arduino {
    time;
    prevTime = "00000";
    port;

    constructor(port) {
        this.port = port;
    }

    convertTime(timeString) {
        return timeString
    }

    get time() {
        const time = port.read().toString();
        return this.convertTime(time);
    }

    get state() {
        const state = port.read().toString();
        return state;
    }

    static get BAUDRATE() {
        return 19200;
    }

    static async getArduinos() {
        try {
            const ports = await serialPort.list();

            let arduinos = [];
            for (const port of ports) {
                const pnpId = port.pnpId ? port.pnpId : "";
                if (pnpId.match(/USB2\.0-Serial/) || pnpId.match(/ttyACM0/)) {
                    const arduinoPort = new serialPort(port.path, {baudRate: Arduino.BAUDRATE});
                    arduinos.push(serialPort)
                }
            }
            return arduinos;

        } catch (err) {
            console.error(err)
        }
    }
}
