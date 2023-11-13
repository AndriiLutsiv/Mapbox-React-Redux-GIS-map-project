export interface Properties {
    uprn: number,
    project_id: number,
    project: string,
    day: number,
    has_voucher: number,
    lat: number,
    lng: number,
    cppp: number
}

export type PropertiesResponse = Properties[];