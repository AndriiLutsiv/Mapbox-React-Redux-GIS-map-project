export interface NodeCompletion {
    complete_day: number,
    dn_nodes_completed: number,
    dn_node_ids: number[] | null,
    dn_node_completed_cumsum: number,
    zn_nodes_completed: number,
    zn_node_ids: number[] | null,
    zn_node_completed_cumsum: number,
    an_nodes_completed: number,
    an_node_ids: number[] | null,
    an_node_completed_cumsum: number,
    total_rfs: number,
    live_customers: number,
    project_id?: number,
    project?: string
}

export type NodeCompletionResponse = NodeCompletion[];