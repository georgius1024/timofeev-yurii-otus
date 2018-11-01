const sum = require('./sum')
// TEST
console.log(sum()) // 0
console.log(sum(1)()) // 1
console.log(sum(1)(2)()) // 3
console.log(sum(1)(2)(3)()) // 6
console.log(sum(1)(2)(3)(4)()) // 10

