"use strict;"
const serialPort = require("serialport");
const Helpers = require("./Helpers");

module.exports = class Stack {
	data = "I00000@0";
	prevData = "I00000@0";
	port;
	lastTimeOn;

	static get OFF_DATA() {
		return "-:--.--";
	}

	static get OFF_DELAY() {
		return Helpers.SECOND;
	}

	static get states() {
		return {
			off: -1,
			unready: 0,
			ready: 1,
			solving: 2,
			solved: 3,
		};
	}

	constructor(port) {
		this.port = port;
		this.port.on("data", this.onData.bind(this));
	}

	static preetifyTime(time) {
		if (time === -1) return "-:--.--";
		const minutes = Math.floor(time / Helpers.MINUTE);
		time %= Helpers.MINUTE;
		const seconds = Math.floor(time / Helpers.SECOND);
		time %= Helpers.SECOND;
		const millis = time;

		let timeString = "";

		if (minutes) {
			timeString += minutes + ":" + ten(seconds);
		} else {
			timeString += seconds;
		}
		timeString += "." + ten(millis);
		return timeString;
	}

	timeToInt(raw) {
		const rawTime = this.timePart(raw);
		if (rawTime === this.timePart(Stack.OFF_DATA)) return -1;
		return parseInt(rawTime[0]) * Helpers.MINUTE + parseInt(rawTime.slice(1));
	}

	timePart(data) {
		return data.slice(1, 6);
	}

	statePart(data) {
		return data[0];
	}
	":--.-"
	get time() {
		const timeInt = this.timeToInt(this.data);
		return Stack.preetifyTime(timeInt);
	}

	get state() {
		const states = Stack.states;
		const currStatePart = this.statePart(this.data);

		if (currStatePart === "-") return states.off;
		if (currStatePart === "A") return states.ready;

		const currTimePart = this.timePart(this.data);
		const prevTimePart = this.timePart(this.prevData);

		const prevStatePart = this.statePart(this.prevData);

		if (prevStatePart === "A" || prevTimePart !== currTimePart) return states.solving;
		if (currTimePart === "00000") return states.unready;
		return states.solved;
	}

	static get BAUDRATE() {
		return 19200;
	}

	updateData(data) {
		this.prevData = this.data;
		this.data = data;
	}

	onData(rawData) {
		const data = rawData.toString();
		console.log(data);
		if (this.isCorrect(data)) {
			if (data === Stack.OFF_DATA) {
				if (Helpers.roundTime(this.lastTimeOn - Date.now()) >= Stack.OFF_DELAY) {
					this.updateData(data)
				}
			}
			else {
				this.updateData(data);
				this.lastTimeOn = Date.now();
			}
		}
	}

	isCorrect(raw) {
		if (raw === Stack.OFF_DATA) {
			return true;
		}
		if (raw.length === 10) {
			const checkSum = raw[6];
			const digits = raw.slice(1, 6).split("");
			const sum =
				64 +
				digits.reduce((currSum, digit) => currSum + digit.charCodeAt(0) - 48, 0);
			if (String.fromCharCode(sum) == checkSum) {
				return true;
			}
		}
		return false;
	}

	static async getStacks() {
		try {
			const ports = await serialPort.list();

			let stacks = [];
			for (const port of ports) {
				const pnpId = port.pnpId ? port.pnpId : "";

				if (
					pnpId.match(/USB2\.0-Serial/) ||
					pnpId.match(/ttyACM0/) ||
					pnpId.match(/USB\\VID_1A86&PID_7523/)
				) {
					const stackPort = new serialPort(port.path, {
						baudRate: Stack.BAUDRATE,
					});
					const stack = new Stack(stackPort);
					stacks.push(stack);
				}
			}
			return stacks;
		} catch (err) {
			console.error(err);
		}
	}
};
