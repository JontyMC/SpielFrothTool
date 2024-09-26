import { computed, ref } from 'vue'
import { Booth, Game, Hall } from './model'
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
  { id: '6-D200', hallId: '6', x: 1047, y: 2008, height: 1274, width: 389 },
  { id: '3-3H613', hallId: '3', x: 2187, y: 2377, height: 111, width: 79 }, //incorrect listing
  { id: '3-H613', hallId: '3', x: 2187, y: 2377, height: 111, width: 79 },
  { id: '3-G511', hallId: '3', x: 2066, y: 2609, height: 159, width: 61 },
  { id: '3-K113', hallId: '3', x: 1251, y: 2174, height: 150, width: 164 },
  { id: '3-J310', hallId: '3', x: 1696, y: 2242, height: 29, width: 156 },
  { id: '3-A112', hallId: '3', x: 1258, y: 3644, height: 213, width: 156 },
  { id: '3-B211', hallId: '3', x: 1419, y: 3515, height: 340, width: 121 },
  { id: '3-G110', hallId: '3', x: 1163, y: 2477, height: 105, width: 26 },
  { id: '3-F112', hallId: '3', x: 1250, y: 2681, height: 118, width: 164 },
  { id: '3-G112', hallId: '3', x: 1250, y: 2333, height: 193, width: 166 },
  { id: '3-N411', hallId: '3', x: 1907, y: 1813, height: 205, width: 219 },
  { id: '3-P611', hallId: '3', x: 2184, y: 1665, height: 338, width: 81 },
  { id: '3-F110', hallId: '3', x: 1163, y: 2588, height: 193, width: 27 },
  { id: '3-B200', hallId: '3', x: 1430, y: 3108, height: 333, width: 196 },
  { id: '3-R211', hallId: '3', x: 1469, y: 1312, height: 110, width: 158 },
  { id: '2-E210', hallId: '2', x: 1030, y: 513, height: 272, width: 158 },
  { id: '2-D432', hallId: '2', x: 2556, y: 904, height: 127, width: 74 },
  { id: '2-D111', hallId: '2', x: 182, y: 520, height: 209, width: 131 },
  { id: '2-B111', hallId: '2', x: 186, y: 1299, height: 224, width: 103 },
  { id: '2-D421', hallId: '2', x: 2426, y: 650, height: 131, width: 137 },
  { id: '2-E315', hallId: '2', x: 1554, y: 306, height: 105, width: 105 },
  { id: '2-E621', hallId: '2', x: 3766, y: 385, height: 220, width: 80 },
  { id: '1-F311', hallId: '1', x: 1541, y: 477, height: 131, width: 228 },
  { id: '1-E211', hallId: '1', x: 829, y: 730, height: 460, width: 601 },
  { id: '4-C431', hallId: '4', x: 2326, y: 2905, height: 250, width: 119 },
  { id: '4-J510', hallId: '4', x: 2622, y: 1272, height: 248, width: 132 },
  { id: '4-C210', hallId: '4', x: 1433, y: 3238, height: 94, width: 189 },
  { id: '4-C611', hallId: '4', x: 2842, y: 2836, height: 186, width: 94 },
  { id: '4-H412', hallId: '4', x: 2029, y: 1843, height: 147, width: 97 },
  { id: '4-F510', hallId: '4', x: 2556, y: 2553, height: 169, width: 78 },
  { id: '5-F311', hallId: '5', x: 1812, y: 905, height: 776, width: 253 },
  { id: '5-B111', hallId: '5', x: 400, y: 2587, height: 178, width: 255 },
  { id: '5-H111', hallId: '5', x: 415, y: 505, height: 95, width: 120 },
  { id: '5-F211', hallId: '5', x: 1106, y: 948, height: 223, width: 313 },
  { id: '5-D221', hallId: '5', x: 1516, y: 1784, height: 445, width: 225 },
  { id: '6-E406', hallId: '6', x: 2639, y: 1295, height: 220, width: 105 },
  { id: '6-C301', hallId: '6', x: 1564, y: 2529, height: 139, width: 526 },
  { id: '6-F300', hallId: '6', x: 1564, y: 425, height: 722, width: 526 },
  { id: '6-B400', hallId: '6', x: 2211, y: 3406, height: 361, width: 308 },
  { id: '6-B300', hallId: '6', x: 1556, y: 3404, height: 390, width: 533 },
  { id: '6-B102', hallId: '6', x: 557, y: 3411, height: 387, width: 392 },
  { id: '6-D102', hallId: '6', x: 559, y: 2008, height: 1269, width: 394 },
  { id: '6-F303', hallId: '6', x: 1650, y: 186, height: 110, width: 588 },
  { id: '6-B101', hallId: '6', x: 339, y: 2510, height: 720, width: 105 },
  { id: '2-E111', hallId: '2', x: 510, y: 307, height: 69, width: 134 },
  { id: '2-E310', hallId: '2', x: 1393, y: 507, height: 278, width: 419 },
  { id: '2-2E450', hallId: '2', x: 2770, y: 513, height: 271, width: 108 },
  { id: '2-D210', hallId: '2', x: 1024, y: 902, height: 268, width: 828 },
  { id: '2-D620', hallId: '2', x: 3552, y: 902, height: 268, width: 101 },
  { id: '3-N311', hallId: '3', x: 1693, y: 1793, height: 108, width: 161 },
  { id: '3-L611', hallId: '3', x: 2179, y: 2147, height: 159, width: 85 },
  { id: '3-P113', hallId: '3', x: 1248, y: 1634, height: 383, width: 378 },
  { id: '3-P411', hallId: '3', x: 1899, y: 1639, height: 119, width: 95 },
  { id: '3-P311', hallId: '3', x: 1693, y: 1634, height: 74, width: 161 },
  { id: '3-R411', hallId: '3', x: 1904, y: 1253, height: 185, width: 222 },
  { id: '3-A411', hallId: '3', x: 1663, y: 3919, height: 26, width: 114 },
  { id: '3-C100', hallId: '3', x: 1158, y: 3176, height: 87, width: 32 },
  { id: '3-H313', hallId: '3', x: 1775, y: 2475, height: 61, width: 74 },
  { id: '3-H511', hallId: '3', x: 1999, y: 2475, height: 61, width: 95 },
  { id: '3-L311', hallId: '3', x: 1693, y: 2078, height: 148, width: 159 },
  { id: '3-Z111', hallId: '3', x: 1246, y: 269, height: 45, width: 77 },
  { id: '3-V110', hallId: '3', x: 1156, y: 521, height: 108, width: 32 },
  { id: '3-Q110', hallId: '3', x: 1153, y: 1171, height: 153, width: 32 },
  { id: '4-B310', hallId: '4', x: 1743, y: 3543, height: 320, width: 323 },
  { id: '4-D211', hallId: '4', x: 1304, y: 2523, height: 312, width: 315 },
  { id: '4-D322', hallId: '4', x: 1843, y: 2745, height: 151, width: 95 },
  { id: '4-F321', hallId: '4', x: 1846, y: 2152, height: 153, width: 90 },
  { id: '4-H522', hallId: '4', x: 2655, y: 1848, height: 148, width: 82 },
  { id: '5-A321', hallId: '5', x: 2134, y: 2993, height: 143, width: 205 },
  { id: '5-C111', hallId: '5', x: 401, y: 2348, height: 158, width: 260 },
  { id: '5-D125', hallId: '5', x: 983, y: 1795, height: 432, width: 67 },
  { id: '5-E111', hallId: '5', x: 413, y: 1432, height: 258, width: 260 },
  { id: '5-F100', hallId: '5', x: 196, y: 816, height: 301, width: 100 },
  { id: '5-F320', hallId: '5', x: 2155, y: 549, height: 253, width: 301 },
  { id: '5-G221', hallId: '5', x: 1492, y: 682, height: 167, width: 212 },
  { id: '5-H222', hallId: '5', x: 895, y: 181, height: 193, width: 489 },
  { id: '6-F102', hallId: '6', x: 556, y: 426, height: 712, width: 468 },
  { id: '4-J420', hallId: '4', x: 2248, y: 1393, height: 156, width: 243 },
  { id: '5-B221', hallId: '5', x: 1430, y: 2530, height: 100, width: 260 },
  { id: '5-E121', hallId: '5', x: 747, y: 1396, height: 131, width: 263 },
  { id: '3-F411', hallId: '3', x: 1901, y: 2813, height: 111, width: 225 },
  { id: '3-S211', hallId: '3', x: 1465, y: 1139, height: 45, width: 164 },
  { id: '3-X112', hallId: '3', x: 1251, y: 328, height: 19, width: 156 },
  { id: '5-F110', hallId: '5', x: 415, y: 923, height: 67, width: 205 }
]
const boothDupe = boothArray.find(
  (x, index) => boothArray.findIndex((y) => y.id === x.id) !== index
)
if (boothDupe) {
  throw 'duplicate booth ' + boothDupe.id
}

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
  const url = `${getApiBaseUri()}/api/data/${userId.value}`
  const { data } = await axios.request<Game[]>({
    method: 'get',
    url
  })
  return data
}

function getApiBaseUri() {
  if (window.location.host.indexOf(':') === -1) {
    return ''
  }
  return 'http://localhost:7124'
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

export const defaultSize = 220
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
