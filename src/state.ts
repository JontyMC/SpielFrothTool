import { computed, ref } from 'vue'
import { Booth, Game, Hall, Position } from './model'
import data from './data.json'
import axios from 'axios'

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

export const userId = computed({
  get: () => localStorage.getItem('userId') ?? '',
  set: (val) => localStorage.setItem('userId', val ?? '')
})
export const halls = arrayToEntityDict(hallArray)
export const booths = arrayToEntityDict(boothArray)
export const games = ref<EntityDict<Game>>({})
export const boothTool = ref(false)
export const info = ref(false)
export const needs = ref(true)
export const wants = ref(true)
export const likes = ref(true)
let tempPositions: { [gameId: string]: Position } = {}

export async function loadGames(api: boolean) {
  if (!userId.value) {
    return
  }
  const localGamesArray: Game[] = Object.entries(localStorage)
    .filter(([key, _]) => key.startsWith(userId.value))
    .map(([_, x]) => JSON.parse(x))
  const localGames = arrayToEntityDict(localGamesArray)
  if (api) {
    const apiGames = await loadGamesFromApi()
    const mergedGames = apiGames.map((game) => {
      const localPosition = localGames[game.id]?.position
      const position = localPosition ?? getInitPosition(game.boothId)
      return { ...game, position, color: priorityToColor(game.priority) }
    })
    games.value = arrayToEntityDict(mergedGames)
  } else {
    games.value = localGames
  }
}

async function loadGamesFromApi() {
  //const url = 'https://tabletoptogether.com/tool/share.php?key=3ec71aebba638f3296802760cf3c6ff7&c=29'
  // const id = '3ec71aebba638f3296802760cf3c6ff7'
  // const url = 'http://localhost:7124/api/data/' + id
  // const { status, data } = await axios.request<string>({
  //   method: 'get',
  //   url,
  //   validateStatus: () => true
  // })
  return data
}

export function resetGames() {
  const saveGames = Object.values(games.value).map((x) => ({
    ...x,
    position: getInitPosition(x.boothId)
  }))
  games.value = arrayToEntityDict(saveGames)
}

export function savePosition(gameId: string, position: Position) {
  tempPositions[gameId] = position
}

export function saveGames() {
  if (!userId.value) {
    return
  }
  Object.keys(localStorage)
    .filter((x) => x.startsWith(userId.value))
    .forEach((x) => localStorage.removeItem(x))
  const saveGames = Object.values(games.value).map((x) => ({
    ...x,
    position: tempPositions[x.id] ?? x.position
  }))
  games.value = arrayToEntityDict(saveGames)
  Object.values(games.value).forEach((x) => localStorage.setItem(x.id, JSON.stringify(x)))
  tempPositions = {}
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

function getInitPosition(boothId: string) {
  const { x, y } = booths[boothId] ?? {}
  if (x && y) {
    return { x: x + 120, y: y - 60, width: 150, height: 150 }
  }
}

function priorityToColor(priority: string) {
  return priority === 'need' ? 'green-200' : priority === 'want' ? 'blue-300' : 'amber-200'
}
