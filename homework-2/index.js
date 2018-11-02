const fn1 = () => {
  console.log('fn1')
  return Promise.resolve(1)
}

const fn2 = () => new Promise(resolve => {
  console.log('fn2')
  setTimeout(() => resolve(2), 100)
})


const asyncFunctions = [fn1, fn2]

function reduceFunction (memo, value) {
  console.log('reduce')
  return memo * value
}

const initialValue = 1

function promiseReduce(asyncFunctions, reduceFunction, initialValue) { 
  return asyncFunctions.reduce((accumulator, func) => {
    return new Promise((resolve, reject) => {
      accumulator.then(memo => { // Ждем аккумулятор
        func().then(value => { // Ждем функцию
            resolve(reduceFunction(memo, value)) // Отправляем новый аккумулятор
          })
      })
    })
  }, Promise.resolve(initialValue))

}


promiseReduce(asyncFunctions, reduceFunction, initialValue)
  .then((result) => console.info(result))