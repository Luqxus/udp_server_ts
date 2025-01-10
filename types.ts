import { Request, Response } from "express"

export type TemperatureData = {
    deviceID: string,
    temperature: number
}

export interface IncomingData  {
    device_id: string;
    key: string;
    value: number;
}

export type Handler<E, T> = (req: E , res: E) => T;