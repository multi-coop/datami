import { v4 as uuidv4 } from 'uuid'

/*
const testJsonTree = {
  label: 'root',
  nodeType: 'arr',
  nodes: [
    {
      label: 'item1',
      nodeType: 'arr',
      nodes: [
        {
          label: 'item1.1',
          nodeType: 'num',
          value: 110
        },
        {
          label: 'item1.2',
          nodeType: 'obj',
          nodes: [
            {
              label: 'item1.2.1',
              nodeType: 'str',
              value: 'a str test'
            }
          ]
        }
      ]
    },
    {
      label: 'item2',
      nodeType: 'str',
      value: 'another str test'
    }
  ]
}
*/
export const nodeTypes = [
  {
    code: 'arr',
    type: 'array',
    icon: 'code-brackets',
    hasValue: false
  },
  {
    code: 'obj',
    type: 'object',
    icon: 'code-braces',
    hasValue: false
  },
  {
    code: 'str',
    type: 'string',
    icon: 'alphabetical',
    hasValue: true,
    class: 'gt-json-str'
  },
  {
    code: 'num',
    type: 'number',
    icon: 'numeric',
    hasValue: true,
    class: 'gt-json-num'
  },
  {
    code: 'float',
    type: 'float',
    icon: 'numeric',
    hasValue: true,
    class: 'gt-json-float'
  },
  {
    code: 'bool',
    type: 'boolean',
    icon: 'checkbox-marked-outline',
    hasValue: true,
    class: 'gt-json-bool'
  }
]

const getNodeTypeCode = (nodeType) => {
  const typeInfos = nodeTypes.find(t => t.type === nodeType)
  return typeInfos.code
}

export const objToNodes = (obj, label) => {
  // console.log('\nU > jsonUtils > objToNodes > label : ', label)
  // console.log('U > jsonUtils > objToNodes > obj : ', obj)
  const node = {
    id: uuidv4(),
    label: label,
    nodeType: undefined
  }
  const objType = typeof obj
  // console.log('U > jsonUtils > objToNodes > objType : ', objType)
  const isObject = objType === 'object'
  const isArray = obj instanceof Array
  node.nodeType = isArray ? getNodeTypeCode('array') : getNodeTypeCode(objType)
  // console.log('U > jsonUtils > objToNodes > isObject : ', isObject)
  // console.log('U > jsonUtils > objToNodes > isArray : ', isArray)

  const nodes = []

  // retrieve value
  if (!isObject) {
    // console.log('U > ... VALUE  > sub : ', obj)
    node.value = obj
  }
  if (isObject) {
    for (const key in obj) {
      // console.log('U > ... > OBJECT > key : ', key)
      const sub = obj[key]
      // console.log('U > ... > OBJECT > sub : ', sub)
      const subObjType = typeof sub
      const isSubObject = subObjType === 'object'
      const isSubArray = sub instanceof Array
      // console.log('U > ... > OBJECT > subObjType : ', subObjType)
      // console.log('U > ... > OBJECT > isSubObject : ', isSubObject)
      // console.log('U > ... > OBJECT > isSubArray : ', isSubArray)

      // loop keys
      if (isSubObject && !isSubArray && sub !== null) {
        const subNode = objToNodes(sub, key)
        // console.log('U > ... OBJECT > OBJ > subNode : ', subNode)
        nodes.push(subNode)
      }
      // loop array
      if (isSubObject && isSubArray && sub !== null) {
        // const subNodes = sub.map((s, i) => {
        //   const node = objToNodes(s, i)
        //   return node
        // })
        const subNode = objToNodes(sub, key)
        // console.log('U > ... OBJECT > ARRAY > objToNodes > subNode : ', subNode)
        nodes.push(subNode)
      }
      // loop keys
      if (!isSubObject && !isSubArray) {
        const subNodes = objToNodes(sub, key)
        // console.log('U > ... OBJECT > VALUE > objToNodes > subNodes : ', subNodes)
        nodes.push(subNodes)
      }
    }
    node.nodes = nodes
  }
  return node
}

export const setEditInNode = (node, modif) => {
  // console.log('\nU > jsonUtils > setEditInNode > node : ', node)
  // console.log('U > jsonUtils > setEditInNode > modif : ', modif)
  const action = modif.action
  const hasNodes = !!node.nodes
  const isParentNode = node.id === modif.parentId
  const isTargetNode = node.id === modif.nodeId
  const continueProcess = !isParentNode && !isTargetNode

  if (!continueProcess && action === 'diff') {
    const isTargetLabel = modif.isLabel
    // console.log('U > jsonUtils > setEditInNode > isTargetNode : ', isTargetNode)
    if (isTargetNode) {
      if (!isTargetLabel) node.value = modif.val
      if (isTargetLabel) node.label = modif.val
    }
  }

  if (!continueProcess && action === 'deleted') {
    node.nodes = node.nodes.filter(n => n.id !== modif.nodeId)
  }

  if (!continueProcess && action === 'added') {
    const newNode = modif.newNode
    newNode.label = newNode.label || 'new'
    node.nodes = [...node.nodes, newNode]
  }

  if (continueProcess && hasNodes) {
    node.nodes = node.nodes.map(subnode => {
      return setEditInNode(subnode, modif)
    })
  }
  return node
}

// /**
//  * Simple object check.
//  * @param item
//  * @returns {boolean}
// */
// export const isObject = (item) => {
//   return (item && typeof item === 'object' && !Array.isArray(item))
// }

// /**
//  * Deep merge two objects.
//  * @param target
//  * @param ...sources
// */
// export const mergeDeep = (target, ...sources) => {
//   if (!sources.length) return target
//   const source = sources.shift()

//   if (isObject(target) && isObject(source)) {
//     for (const key in source) {
//       if (isObject(source[key])) {
//         if (!target[key]) Object.assign(target, { [key]: {} })
//         mergeDeep(target[key], source[key])
//       } else {
//         Object.assign(target, { [key]: source[key] })
//       }
//     }
//   }

//   return mergeDeep(target, ...sources)
// }

// export const findNodeById = (obj, id) => {
//   if (obj.id === id) return obj
//   const subNodes = obj.nodes
//   if (subNodes) return findNodeById(subNodes, id)
//   else return false
// }
// export const mergeJsons = (objEdited, objOriginal) => {
//   return mergeDeep(objEdited, objOriginal)
// }

export const nodeToObj = (node, isRoot = false) => {
  // console.log('\nU > jsonUtils > objToNodes > node : ', node)
  const nodeType = node.nodeType
  const nodeChildren = node.nodes && node.nodes.length && node.nodes
  // const label = node.label
  // console.log('U > jsonUtils > objToNodes > nodeType : ', nodeType)
  let obj
  if (nodeType === 'arr') {
    obj = []
    nodeChildren && nodeChildren.forEach(subNode => {
      // console.log('U > jsonUtils > objToNodes > subNode : ', subNode)
      const newObj = nodeToObj(subNode)
      obj.push(newObj)
    })
  }
  if (nodeType === 'obj') {
    obj = {}
    nodeChildren && nodeChildren.forEach(subNode => {
      // console.log('U > jsonUtils > objToNodes > subNode : ', subNode)
      const newObj = nodeToObj(subNode)
      obj[subNode.label] = newObj
    })
  }
  if (nodeType !== 'obj' && nodeType !== 'arr') {
    obj = node.value
  }
  return obj
}
