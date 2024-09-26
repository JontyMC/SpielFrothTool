import { computed, ref } from 'vue'
import { Booth, Game, Hall } from './model'
import data from './data.json'
import axios from 'axios'
import { useStorage } from '@vueuse/core'

export type EntityDict<T extends { id: string }> = { [id: string]: T }

export const imagePrefix = 'https://tabletoptogether.com/tool/'

const hallArray: Hall[] = [
  { id: '1', width: 4598, height: 2392 },
  { id: '2', width: 4140, height: 2241 },
  { id: '3', width: 3509, height: 4023 },
  { id: '4', width: 3509, height: 4294 },
  { id: '5', width: 3167, height: 3508 },
  { id: '6', width: 3026, height: 4549 }
]

const boothArray: Booth[] = [
  { id: '3-Z411', hallId: '3', x: 1875, y: 287, height: 309, width: 259 },
  { id: '3-V411', hallId: '3', x: 1904, y: 655, height: 144, width: 229 },
  { id: '3-F113', hallId: '3', x: 1247, y: 2847, height: 195, width: 380 },
  { id: '3-B113', hallId: '3', x: 1250, y: 3512, height: 42, width: 125 },
  { id: '3-G210', hallId: '3', x: 1467, y: 2370, height: 168, width: 154 },
  { id: '3-F410', hallId: '3', x: 1900, y: 2647, height: 119, width: 164 },
  { id: '3-U411', hallId: '3', x: 1904, y: 846, height: 227, width: 223 },
  { id: '3-G311', hallId: '3', x: 1692, y: 2604, height: 324, width: 162 },
  { id: '3-S311', hallId: '3', x: 1694, y: 1142, height: 318, width: 158 },
  { id: '3-B311', hallId: '3', x: 1694, y: 1142, height: 318, width: 158 },
  { id: '3-D611', hallId: '3', x: 2141, y: 3123, height: 338, width: 121 },
  { id: '4-F520', hallId: '4', x: 2649, y: 2432, height: 188, width: 103 },
  { id: '2-E330', hallId: '2', x: 1902, y: 517, height: 266, width: 160 },
  { id: '2-B631', hallId: '2', x: 3758, y: 1259, height: 266, width: 78 },
  { id: '5-H410', hallId: '5', x: 2308, y: 203, height: 68, width: 253 },
  { id: '5-A411', hallId: '5', x: 2478, y: 3009, height: 145, width: 214 },
  { id: '5-E221', hallId: '5', x: 1503, y: 1381, height: 142, width: 199 },
  { id: '6-F400', hallId: '6', x: 2219, y: 425, height: 724, width: 297 },
  { id: '6-F200', hallId: '6', x: 1125, y: 426, height: 724, width: 312 },
  { id: '6-D200', hallId: '6', x: 1047, y: 2008, height: 1274, width: 389 }
]

export const userId = useStorage('userId', '')
export const halls = arrayToEntityDict(hallArray)
export const booths = arrayToEntityDict(boothArray)
export const games = ref<EntityDict<Game>>({})
export const boothTool = ref(false)
export const info = useStorage('info', false, undefined, { writeDefaults: false })
export const needs = ref(true)
export const wants = ref(true)
export const likes = ref(true)

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
    const mergedGames = apiGames
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce(
        (acc, game) => {
          const localGame = localGames[game.id]
          const srcInit = localGame?.srcInit ?? false
          const index = (acc.count[game.boothId] ?? -1) + 1
          const position = localGame?.position ?? getInitPosition(game.boothId, index)
          acc.count[game.boothId] = index
          acc.games.push({
            ...game,
            position,
            color: priorityToColor(game.priority),
            srcInit,
            index
          })
          return acc
        },
        <{ count: { [boothId: string]: number }; games: Game[] }>{ count: {}, games: [] }
      ).games
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
    position: getInitPosition(x.boothId, x.index),
    srcInit: false
  }))
  games.value = arrayToEntityDict(saveGames)
}

export function saveGames() {
  if (!userId.value) {
    return
  }
  Object.keys(localStorage)
    .filter((x) => x.startsWith(userId.value))
    .forEach((x) => localStorage.removeItem(x))
  Object.values(games.value).forEach((x) => localStorage.setItem(x.id, JSON.stringify(x)))
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

const defaultSize = 180
const radiusIncrement = defaultSize * 1.3
const itemsOnCircle = 5
const startAngle = -(1.8 * Math.PI) / itemsOnCircle
function getInitPosition(boothId: string, index: number) {
  const booth = booths[boothId] ?? {}
  if (booth) {
    const radius = radiusIncrement * (Math.floor(index / itemsOnCircle) + 1)
    const angle = startAngle + (2 * Math.PI * index) / itemsOnCircle
    const x = booth.x + booth.width / 2 + radius * Math.cos(angle)
    const y = booth.y + booth.height / 2 + radius * Math.sin(angle)
    return { x, y, width: defaultSize, height: defaultSize }
  }
}

function priorityToColor(priority: string) {
  return priority === 'need' ? 'green-200' : priority === 'want' ? 'blue-300' : 'amber-200'
}
