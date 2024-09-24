export type Game = {
  id: string
  boothId: string
  src: string
}

export type Dimensions = {
  top: number
  left: number
  bottom: number
  right: number
}

export type Booth = Dimensions & {
  id: string
  name: string
}

export type Hall = {
  width: number
  height: number
  booths: Booth[]
  games: Game[]
}
