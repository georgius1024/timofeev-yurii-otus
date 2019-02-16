/*
 * MyTree - компонент, отображающий дерево
 * Дерево содержится в структуре наподобие:
 * {
 *   id: 1,
 *   items: [
 *    {
 *      id: 2,
 *      items: [
 *        {
 *          id: 3
 *        }
 *      ]
 *    }
 *  ]
 * }
 * 1) Один корневой элемент
 * 2) Каждый элемент имеет атрибут id
 * 3) Каждый элемент может иметь items - массив дочерних элементов
 * Согласно "Custom Element Best Practices", объект получает дерево
 * через установку свойства tree в рантайме
 * Под капотом используется один корневой MyLeaf, которому передается вся структура дерева
 */

function createChildNode(id, items) {
  const node = document.createElement('my-leaf')
  node.id = id
  node.items = items
  return node
}

export class MyTree extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._tree = {}
  }
  set tree(value) {
    this._tree = value
    this.render()
  }
  get tree() {
    return this._tree
  }
  connectedCallback() {
    this.render()
  }
  render() {
    this.shadowRoot.innerHTML = `
          <style>
              :host {
                display: block;
                background-color: lightblue;
                color: #333;
                padding:32px;
              }
            </style>
          `
    const rootNode = createChildNode(this.tree.id, this.tree.items)
    this.shadowRoot.appendChild(rootNode)
  }
}

/*
 * MyLeaf - компонент, отображающий поддерево
 * Имеет свойство id - код
 * Может иметь свойство items - массив дочерних элементов (структура - см. выше)
 * Согласно "Custom Element Best Practices", свойства устанавливаются в рантайме
 */

export class MyLeaf extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
  connectedCallback() {
    this.render()
  }
  set id(value) {
    this._id = value
    this.render()
  }
  get id() {
    return this._id
  }
  set items(value) {
    this._items = value
    this.render()
  }
  get items() {
    return this._items
  }
  render() {
    this.shadowRoot.innerHTML = `
            <style>
              :host {
                display: block;
                background-color: #888;
                color: #FFF;
                padding:4px;
                padding-left:24px;
              }
            </style>
            <div>#${this.id}</div>
          `
    if (Array.isArray(this.items)) {
      this.items.forEach(item => {
        const childNode = createChildNode(item.id, item.items)
        this.shadowRoot.appendChild(childNode)
      })
    }
  }
}

export default function registerComponents() {
  window.customElements.define('my-tree', MyTree)
  window.customElements.define('my-leaf', MyLeaf)
}
