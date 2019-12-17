module.exports = class Helpers {
    static get SECOND() {
        return 100
    };

    static get MINUTE() {
        return 60 * Helpers.SECOND
    };

    ten(x) {
        if (x < 10) return "0" + x;
        return "" + x;
    };

    roundTime(time) {
        return Math.round(time / 10);
    }
}