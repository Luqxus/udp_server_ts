import pg from 'pg';
import { TemperatureData } from './types';


const { Client } = pg;



// storage options
export type StorageOptions =  {
    host: string,
    database: string,
    port: number
    password: string,
    user: string
}



// storage
export class Storage {

    //storage client
    client: pg.Client| null = null;

    constructor(opts: string | pg.ClientConfig | undefined) {
        // initialize storage client with provided options
        this.client = new Client(opts)

    }

    connect = async  () => {
        await this.client!.connect()
        // .then(() => {console.log("connected")}).catch((e) =>{ console.error(e)});
    }

    // write temperature data to storage client
    writeTemperatureData = async (data: TemperatureData): Promise<boolean> => {

        // write query
        const query = `insert into temperatures (device_id, temperature) values(${data.deviceID}, ${data.temperature})`;

        
        const result: Promise<boolean> | undefined= this.client?.query(query).then(() => {

            // return true if successful
            return true;
        }).catch((err) => {
            console.log(err);

            //return false with error occured
            return false;
        });

        // return query results
        return result?? false
    }
    
    readTemperatureData = async (deviceID: string): Promise<TemperatureData[]> => {
        const query = `select * from temperatures where device_id = ${deviceID}`;

        try {
            const result = await this.client?.query(query);
            
            // Use map instead of forEach to properly return an array
            return result?.rows.map(row => ({
                deviceID: row.device_id,
                temperature: row.temperature
            })) || [];
        } catch (err) {
            console.log(err);
            return [];
        }
    }
}