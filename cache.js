const Emitter = require("events").EventEmitter
const emitter = new Emitter()

let temp = {}

//reset cache
emitter.on("flush", () => temp = {})

//clear messages
emitter.on("flushMessages", () => {
    delete temp.indexMessages;
    delete temp.dashMessages;
})



exports.temp = temp
exports.emitter = emitter;