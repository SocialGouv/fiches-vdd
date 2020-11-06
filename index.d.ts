export as namespace ficheVdd

export type RawJson = {
  name: string
  text: string
  type: string
  attributes: { ID: string, URL: string }
  children: RawJson[]
}
export function getFiche(type: string, id: string): RawJson
