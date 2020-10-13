const Emitter = require("events").EventEmitter
const emitter = new Emitter()

let temp = {}


emitter.on("flush", () => {for(let key in temp) delete temp[key]} )


//clear messages
emitter.on("flushMessages", (id) => {
    if(id) delete temp[id]
    delete temp.indexMessages;
    delete temp.dashMessages;
}) 


exports.temp = temp
exports.emitter = emitter;
