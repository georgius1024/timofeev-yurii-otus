import registerComponents from './my-tree.js'

registerComponents()

document.addEventListener('DOMContentLoaded', function(event) {
  const treeData = {
    id: 1,
    items: [
      {
        id: 2,
        items: [
          {
            id: 3,
          },
          {
            id: 4,
          },
          {
            id: 5,
          }
        ],
      },
      {
        id: 6
      }
    ],
  }
  const myTree = document.getElementsByTagName('my-tree')[0]
  if (myTree) {
    myTree.tree = treeData
  }
})
