export interface Broadbands {
    uprn_count: number;
    speed_0_2_mbs: number;
    speed_2_5_mbs: number;
    speed_5_10_mbs: number;
    speed_10_30_mbs: number;
    speed_30_300_mbs: number;
    speed_300_above_mbs: number;
    speed_no_internet:number;
    project_id?: number;
    project?: string;
}

export type BroadbandsResponse = Broadbands[];