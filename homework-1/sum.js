function sum(x) {
  let accum = 0
  const _sum = (x) => {
    if (typeof x === 'undefined') {
      return accum
    } else {
      accum += Number(x)
      return _sum
    }
  }
  return _sum(x)
}

module.exports = sum