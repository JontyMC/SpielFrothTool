import { watch, WatchSource } from 'vue'

export function watchDebug(name: string, source: WatchSource) {
  return watch(source, (value) => console.log(name, value))
}
