import { computed, ref } from 'vue'
import { Booth, Game, Hall } from './model'

export type EntityDict<T extends { id: string }> = { [id: string]: T }

const hallArray: Hall[] = [
  {
    id: '3',
    width: 3509,
    height: 4023
  }
]

const boothArray: Booth[] = [
  { id: '3-Z411', hallId: '3', x: 1875, y: 287, height: 309, width: 259 },
  { id: '3-V411', hallId: '3', x: 1904, y: 655, height: 144, width: 229 },
  { id: '3-F113', hallId: '3', x: 1247, y: 2847, height: 195, width: 380 },
  { id: '3-B113', hallId: '3', x: 1250, y: 3512, height: 42, width: 125 }
]

export const halls = arrayToEntityDict(hallArray)
export const booths = arrayToEntityDict(boothArray)
export const games = ref<EntityDict<Game>>({})
export const boothTool = ref(false)
export const info = ref(false)
export const needs = ref(true)
export const wants = ref(true)
export const likes = ref(true)

export function loadGames(userId: string, apiGames?: Game[]) {
  const localGamesArray: Game[] = Object.entries(localStorage)
    .filter(([key, _]) => key.startsWith(userId))
    .map(([_, x]) => JSON.parse(x))
  const localGames = arrayToEntityDict(localGamesArray)
  if (apiGames) {
    const mergedGames = apiGames.map((game) => {
      const { position } = localGames[game.id] ?? {}
      return { ...game, position, color: priorityToColor(game.priority) }
    })
    localGamesArray.forEach((x) => localStorage.removeItem(x.id))
    mergedGames.forEach((x) => saveGame(x))
    games.value = arrayToEntityDict(mergedGames)
  } else {
    games.value = localGames
  }
}

export function saveGame(game: Game) {
  localStorage.setItem(game.id, JSON.stringify(game))
}

export const boothsByHall = computed(() =>
  Object.values(booths).reduce((acc, booth) => {
    const booths = acc[booth.hallId] ?? []
    booths.push(booth)
    acc[booth.hallId] = booths
    return acc
  }, <{ [hallId: string]: Booth[] }>{})
)

export const gamesByHall = computed(() =>
  Object.values(games.value).reduce((acc, game) => {
    const games = acc[game.hallId] ?? []
    games.push(game)
    acc[game.hallId] = games
    return acc
  }, <{ [hallId: string]: Game[] }>{})
)

export function arrayToEntityDict<T extends { id: string }>(array: T[]) {
  return array.reduce((x, y) => {
    x[y?.id] = y
    return x
  }, <EntityDict<T>>{})
}

function priorityToColor(priority: string) {
  return priority === 'need' ? 'green-200' : priority === 'want' ? 'blue-300' : 'amber-200'
}
