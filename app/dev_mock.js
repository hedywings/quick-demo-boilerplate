var _ = require('busyman'),
    Q = require('q');
var Peripheral = require('../node_modules/ble-shepherd/lib/model/peripheral');

var sensorPeriph,
    ctrlPeriph,
    switchPeriph;

var sensorPeriphInfo = {
        addr: '0x000000000000',
        addrType: 'public',
        connHandle: 200,
        servList: [
            {
                uuid: '0xbb00',
                handle: 1,
                startHandle: 1,
                endHandle: 14,
                charList: [
                    // temperature
                    {
                        uuid: '0xcc07',
                        handle: 2,
                        prop: [ 'read', 'notify' ],
                        desc: null,
                        value: {
                            id: 0, 
                            flags: 1, 
                            sensorValue: 26, 
                            units: 'C'
                        }
                    },
                    //humidity
                    {
                        uuid: '0xcc08',
                        handle: 5,
                        prop: [ 'read', 'notify' ],
                        desc: null,
                        value: {
                            id: 0, 
                            flags: 1, 
                            sensorValue: 47, 
                            units: '%RH'
                        }
                    },
                    // illuminance
                    {
                        uuid: '0xcc05',
                        handle: 8,
                        prop: [ 'read', 'notify' ],
                        desc: null,
                        value: {
                            id: 0, 
                            flags: 1, 
                            sensorValue: 85, 
                            units: 'lux'
                        }
                    },
                    // flame
                    {
                        uuid: '0xcc',
                        handle: 11,
                        prop: [ 'read', 'notify' ],
                        desc: null,
                        value: {
                            id: 0, 
                            flags: 1, 
                            sensorValue: 85, 
                            units: 'lux'
                        }
                    }                 
                ]
            }            
        ]
    },
    ctrlPeriphInfo = {
        addr: '0x000000000001',
        addrType: 'public',
        connHandle: 201,
        servList: [
            {
                uuid: '0xbb10',
                handle: 15,
                startHandle: 15,
                endHandle: 24,
                charList: [
                    // pir
                    {
                        uuid: '0xcc00',
                        handle: 16,
                        prop: [ 'read', 'notify' ],
                        desc: null,
                        value: { 
                            id: 0, 
                            flags: 0, 
                            dInState: false 
                        }
                    },
                    // buzzer
                    {
                        uuid: '0xcc28',
                        handle: 19,
                        prop: [ 'read', 'write', 'notify' ],
                        desc: null,
                        value: { 
                            id: 0, 
                            flags: 0, 
                            onOff: false,
                            minOffTime: 0
                        }
                    },
                    // light
                    {
                        uuid: '0xcc0d',
                        handle: 22,
                        prop: [ 'read', 'write', 'notify' ],
                        desc: null,
                        value: { 
                            id: 0, 
                            flags: 0, 
                            onOff: false 
                        }
                    }
                ]
            }
        ]
    },
    switchPeriphInfo = {
        addr: '0x000000000002',
        addrType: 'public',
        connHandle: 202,
        servList: [
            {
                uuid: '0xbb20',
                handle: 25,
                startHandle: 25,
                endHandle: 29,
                charList: [
                    // switch
                    {
                        uuid: '0xcc0d',
                        handle: 26,
                        prop: [ 'read', 'notify' ],
                        desc: null,
                        value: { 
                            id: 0, 
                            flags: 0, 
                            dInState: false 
                        }
                    }
                ]
            }
        ]
    };

function fakeWrite (sid, cid, value, callback) {
    var self = this,
        char,
        emitMsg = {
            type: 'attChange',
            periph: self,
            data: {
                sid: {
                    uuid: null,
                    handle: null
                },
                cid: {
                    uuid: null,
                    handle: null
                },
                value: null
            }
        };

    if (_.isNil(value) || (!_.isPlainObject(value) && !Buffer.isBuffer(value))) 
        throw new TypeError('value must be an object or a buffer');

    char = self.findChar(sid, cid);
    char.value = value;

    emitMsg.data.sid.uuid = char._service.uuid;
    emitMsg.data.sid.handle = char._service.handle;
    emitMsg.data.cid.uuid = char.uuid;
    emitMsg.data.cid.uuid = char.uuid;
    emitMsg.data.value = char.value;

    self._central.emit('ind', emitMsg);
}

function fakeDisconnect () {
    var deferred = Q.defer();
    deferred.resolve();
    return deferred.promise;
}

function createPeriph (periphInfo) {
    var periph = new Peripheral(periphInfo);

    periph.status = 'online';
    periph.attatchServs(periphInfo.servList);
    periph.write = fakeWrite.bind(periph);
    periph.disconnect = fakeDisconnect.bind(periph);

    return periph;
}

module.exports = {
    sensorPeriph: createPeriph(sensorPeriphInfo),
    ctrlPeriph: createPeriph(ctrlPeriphInfo),
    switchPeriph: createPeriph(switchPeriphInfo)
};