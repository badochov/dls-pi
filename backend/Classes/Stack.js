const serialPort = require("serialport");
const SECOND = 100;
const MINUTE = 60 * SECOND;
const ten = x => {
	if (x < 10) return "0" + x;
	return "" + x;
};
//todo add support for turned off timer

module.exports = class Stack {
	data = "I00000@0";
	prevData = "I00000@0";
	port;

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
		const minutes = Math.floor(time / MINUTE);
		time %= MINUTE;
		const seconds = Math.floor(time / SECOND);
		time %= SECOND;
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
		if (rawTime === ":--.-") return -1;
		return parseInt(rawTime[0]) * MINUTE + parseInt(rawTime.slice(1));
	}

	timePart(data) {
		return data.slice(1, 6);
	}

	statePart(data) {
		return data[0];
	}

	get time() {
		const timeInt = this.timeToInt(this.data);
		return Stack.preetifyTime(timeInt);
	}

	get state() {
		const states = Stack.states;
		const currState = this.statePart(this.data);

		if (currState === "A") return states.ready;
		const currTime = this.timePart(this.data);
		const prevTime = this.timePart(this.prevData);

		const prevState = this.statePart(this.prevData);

		if (prevState === "A" || prevTime !== currTime) return states.solving;
		if (currTime === "00000") return states.unready;
		return states.solved;
	}

	static get BAUDRATE() {
		return 19200;
	}

	onData(data) {
		const dataString = data.toString();
		console.log(dataString);
		if (this.isCorrect(dataString)) this.prevData = this.data;
		this.data = dataString;
	}

	isCorrect(raw) {
		if (raw.length == 10) {
			const checkSum = raw[6];
			const digits = raw.slice(1, 6).split("");
			const sum =
				64 +
				digits.reduce((currSum, digit) => currSum + parseInt(digit), 0);
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
				console.log(port);

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
