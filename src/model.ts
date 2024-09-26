export type Game = {
  id: string
  bggId: string
  name: string
  publisher: string
  url: string
  priority: string
  price: string
  color?: string
  boothId: string
  hallId: string
  src: string
  position?: Position
  srcInit: boolean
  index: number
}

export type Position = {
  x: number
  y: number
  width: number
  height: number
}

export type Booth = Position & {
  id: string
  hallId: string
}

export type Hall = {
  id: string
  width: number
  height: number
}

export function gameId(userId: string, game: Game) {
  return `${userId}_${game.boothId}_${game.id}`
}

export function sortStrings<T>(a: T, b: T, v: (t: T) => string, desc?: boolean): number {
  const aStr = v(desc ? b : a) || ''
  const bStr = v(desc ? a : b) || ''
  return sortStringValues(aStr, bStr)
}

export function sortStringValues(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

export const priorityOrder: Record<string, number> = {
  need: 1,
  want: 2,
  like: 3
}
