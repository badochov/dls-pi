const Stack = require('./Stack');

module.exports = class Relay {
    stacks;
    /**
     * 0 - "Ręce na stopery"
     * 1 - "Start"
     * 2 - "Układanie"
     * 3 - "Stop"
     * 4 - "DNF"
     */
    phase = 0;
    startTime = 0;
    stopTime = 0;
    sockets;


    static get phases() {
        return {unready: 0, ready: 1, solving: 2, solved: 3, DNF: 4};
    }


    text() {
        switch (this.phase) {
            case Relay.phases.unready:
                return "Ręce na timery";
            case Relay.phases.ready:
                return "Start";
            case Relay.phases.solving:
                this.stopTime = Date.now()
                return this.time;
            case Relay.phases.solved:
                return this.time;
            case Relay.phases.DNF:
                return "DNF";
        }
    }

    constructor(stacks, sockets) {
        if (stacks.length === 0) {
            throw "Not enough stacks";
        }
        this.stacks = stacks;
        this.sockets = sockets;
    }

    get time() {
        const timeInt = Math.round((this.stopTime - this.startTime) / 10);
        return Stack.preetifyTime(timeInt)
    }

    sendMessage(name, data) {
        this.sockets.forEach((socket) => socket.emit(name, data))
    }

    sendStacks() {
        const stacks = [];
        this.stacks.forEach(stack => stacks.push({time: stack.time, state: stack.state}));
        this.sendMessage("stacks", stacks)
    }

    sendTexts() {
        this.sendMessage("text", this.text());
    }

    sendPhase() {
        this.sendMessage("phase", this.phase);
    }

    tick() {
        const states = this.stacks.map(stack => stack.state);
        switch (this.phase) {
            case Relay.phases.unready:
                this.unreadyPhase(states);
                break;
            case Relay.phases.ready:
                this.readyPhase(states);
                break;
            case Relay.phases.solving:
                this.solvingPhase(states);
                break;
            case Relay.phases.solved:
                this.solvedPhase(states);
                break;
            case Relay.phases.DNF:
                this.dnfPhase(states);
                break;
        }

        this.sendStacks();
        this.sendTexts();
        this.sendPhase();
    }

    unreadyPhase(states) {
        if (states.every(state => state <= Stack.states.ready)) {
            if (states.every(state => state === Stack.states.ready)) {
                this.phase = Relay.phases.ready;
            }
        } else
            this.phase = Relay.phases.DNF;
    }

    readyPhase(states) {
        const readyCount = states.reduce((sum, state) => sum + (state === Stack.states.ready ? 1 : 0), 0);
        if (readyCount !== states.length) {
            if (states[0] > Stack.states.ready && states.length - 1 === readyCount) {
                this.phase = Relay.phases.solving;
                this.startTime = Date.now()
            } else
                this.phase = Relay.phases.DNF;
        }
    }

    solvingPhase(states) {
        const solvingCount = states.reduce((sum, state) => sum + (state === Stack.states.solving ? 1 : 0), 0);
        console.log(states);
        switch (solvingCount) {
            case 0:
                this.stopTime = Date.now();
                this.phase = Relay.phases.solved;
                break;
            case 1:
                const solvingIndex = states.indexOf(Stack.states.solving);
                for (let i = 0; i < solvingIndex; i++) {
                    if (states[i] !== Stack.states.solved) {
                        this.phase = Relay.phases.DNF;
                        break;
                    }
                }
                const size = states.length;
                for (let i = solvingIndex + 1; i < size; i++) {
                    if (states[i] !== Stack.states.ready) {
                        this.phase = Relay.phases.DNF;
                        break;
                    }
                }
                break;
            default:
                this.phase = Relay.phases.DNF;
        }
    }

    solvedPhase(states) {
        if (states.every(state => state <= Stack.states.ready)) {
            this.phase = Relay.phases.unready;
        }
    }

    dnfPhase(states) {
        if (states.every(state => state <= Stack.states.ready)) {
            this.phase = Relay.phases.unready;
        }
    }
};
