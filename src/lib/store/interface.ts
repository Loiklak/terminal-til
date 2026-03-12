export interface TIL {
  id: string
  title?: string
  content: string
  createdAt: number
}

export interface TILStore {
  getAll(): Promise<TIL[]>
  add(content: string, title?: string): Promise<TIL>
}
