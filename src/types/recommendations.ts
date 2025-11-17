export interface Recommendation {
  id: number
  description: string
  min_severity: number
  max_severity: number
  type: RecommendationType
}

export interface RecommendationType {
  id: number
  name: string
  description: string
}
