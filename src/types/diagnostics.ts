export interface DiagnosticFilterRequest {
  labels?: string[];
  plot_ids?: (number | null)[]
  min_date?: string
  max_date?: string
  item_fields?: string
  limit: number
  page: number
}

export interface DiagnosticFilterResponse {
  total: number
  page: number
  limit: number
  items: any[]
}
