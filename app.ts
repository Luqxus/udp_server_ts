import dgram from 'dgram';

const server = dgram.createSocket('udp4');

const PORT: number = 3000;
const HOST: string = "127.0.0.1";


const handleListen = () => {
    console.log("listening........")
    console.log(`server listening on port : ${PORT}`);
}

server.on('listening', handleListen);

const initialize = (port: number, host: string) => {
    server.bind(port, host);

    server.on('message', (dataStream:Buffer, remoteInfo: dgram.RemoteInfo) => {
        console.log('data : ', dataStream.readUInt8());
        console.log('remote info : ', remoteInfo);

        if (dataStream.readUInt8() > 40) {
            console.log("fire alert")
        }
    });
}

initialize(PORT, HOST);