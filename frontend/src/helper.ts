import { DbayItem } from '.dummy/data'
interface SearchResult {
  items: DbayItem[]
}

function validateObject(obj: Object, targetLength: number) {
  let keys = Object.keys(obj) as (keyof typeof obj)[]
  if (keys.length != targetLength) {
    return false
  }

  for (let key of keys) {
    let attr = obj[key]
    if (!attr) {
      return false
    }
  }

  return true
}

async function searchItems(keyword: string, searchType='itemName', sortBy='createTime') {

  interface SearchPayload {
    searchType: string,
    keyword: string,
    sortBy: string
  }

  let payload: SearchPayload = {
    searchType: searchType,
    keyword: keyword,
    sortBy: sortBy
  }

  let res: SearchResult = await (await fetch('/api/items/search', { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(payload) })).json()
  return res
}

export { SearchResult, validateObject, searchItems }
