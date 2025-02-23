export interface ApiResponse<T> {
  timestamp: string,
  code: number,
  status: string,
  message: string,
  data: T
}
