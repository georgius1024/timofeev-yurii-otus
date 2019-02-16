# About
Седьмая домашняя работа в потоке javascrit-2018-10 OTUS

# Description
getPath - поиск уникального селектора
Написать алгоритм и функцию `getPath()`, находяющую уникальный css-селектор для элемента в документе.
Уникальный селектор может быть использован `document.querySelector()` и возвращать исходный элемент. 
`document.querySelectorAll()`, вызванный с этим селектором, не должен находить никаких элементов, кроме исходного.

```javascript
$0 // HTMLElement
getPath($0) // => "..."
```
# How to
Просто открываем файл index.html в браузере и кликаем.
По клику определяется path текущего элемента и он подсвечивается.
Если getPath возвращает неправильное значение, выдается сообщение об ошибке.
Можно просто скопировтаь и вставить в консоль браузера код функции:
```javascript
  function getPath(element) {
    const path = []
    while(element) {
      const entry = {
        element,
        index: -1
      }
      path.push(entry)
      if (element.tagName !== 'BODY') {
        if (element.parentElement.children.length > 1) {
          // НАЙТИ ЭЛЕМЕНТ В СПИСКЕ СИБЛИНГОВ
          for(let i = 0; i < element.parentElement.children.length; i++) {
            if (element.parentElement.children[i] === element) {
              entry.index = i
              break
            }
          }
        } else {
          entry.index = -1
        }
        element = element.parentElement // <-- НАВЕРХ
      } else {
        break // поднялись до BODY, выше не идем
      }
    }
    path.reverse() // Обратный порядок
    return path
      .map((e, index) => { // Сборка элементов
        const first = index === 0
        const tag = e.element.tagName.toLowerCase()
        if (first) {
          return `${tag}`
        } else if (e.index >= 0) {
          return `>${tag}:nth-child(${e.index+1})`
        } else {
          return `>${tag}`
        }
      })
      .join('') // Склеивание
  }
```

#Notes
Не очень пока понял, как тестировать внутрибраузерные вещи - DOM, события. 
Можно бы взять Jest, но как его прикрутить к ванильному JS и к обычному HTML - не совсем понятно.