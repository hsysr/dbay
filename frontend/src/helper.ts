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

export { validateObject }
