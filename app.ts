import dgram from 'dgram';
import { JsonDecoder, Result } from 'ts.data.json';
import { IncomingData } from './types';
import { Storage } from './storage';
require('dotenv').config()

const server = dgram.createSocket('udp4');

const PORT: number = 3000;
const HOST: string = "127.0.0.1";

// server options from environment
const {DB_PASSWORD, DATABASE, DB_USER, DB_HOST, DB_PORT} = process.env; 


// new storage
const storage = new Storage({password: DB_PASSWORD, database: DATABASE, user: DB_USER, host: DB_HOST, port: parseInt(DB_PORT!)})





const handleListen = () => {
    console.log("listening........")
    console.log(`server listening on port : ${PORT}`);
}


// on listening
server.on('listening', handleListen);

const initialize = async (port: number, host: string) => {

    await storage.connect();

    server.bind(port, host);



    // on incoming message
    server.on('message', (dataStream:Buffer, remoteInfo: dgram.RemoteInfo) => {
        console.log('data : ', dataStream.readUInt8());
        console.log('remote info : ', remoteInfo);

        console.log(dataStream.toString())

        // decode data
        // const result = _decodeIncomingData(dataStream)
        const result: IncomingData = JSON.parse(dataStream.toString())

        console.log(result)

        // handle decoded data
        _handleData(result).then(() => {
            console.log("handled")
        }).catch((e) => {
            console.error(e)
        })

    });
}


// decode incoming byte data to IncomingData type
const _decodeIncomingData = (dataStream:Buffer) => {

    // incoming data decoder
    const incomingData = JsonDecoder.object<IncomingData>(
        {
            device_id: JsonDecoder.string,
            key: JsonDecoder.string,
            value: JsonDecoder.number
        },
        'IncomingData'
    )


    // decode data
    const result =  incomingData.decode(dataStream.toJSON());

    console.log(result)

    // return decoded data
    return result
}


// handle decoded incoming data
const _handleData = async (result: IncomingData) => {
    console.log("handling...")
   
    console.log("data key = ", result.key);

    // check incoming data type | fire | temperature data
    if (result.key == 'fire') {
        
        if (result.value >=50) {

            // if fire detection confidence is greater or equals to 50 ring alarm
            console.log("fire alert")
        }
    } else if (result.key == 'temperature') {
        console.log("key = temperature");
        // write temperature data to storage
        const success = await storage.writeTemperatureData({deviceID:result.device_id, temperature: result.value});
        console.log(success);
    }
    
}


// server initilialization
initialize(PORT, HOST).then(() => {
    "running"
}).catch((e) => {
    console.log(e);
});