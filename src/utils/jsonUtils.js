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

// let nodes = {
//   label: 'root',
//   nodeType: undefined,
//   nodes: []
// }

// const partial = (arr = [], condition) => {
//   const result = []
//   arr.forEach(a => {
//     if (condition(a)) result.push(a)
//   })
// }

const getNodeTypeCode = (nodeType) => {
  const typeInfos = nodeTypes.find(t => t.type === nodeType)
  return typeInfos.code
}

export const objToNodes = (obj, label) => {
  // console.log('\nU > jsonUtils > objToNodes > label : ', label)
  // console.log('U > jsonUtils > objToNodes > obj : ', obj)
  const node = {
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
  // if (nodes.length > 1) {
  //   node.nodes = nodes
  // }
  // node.nodes = nodes
  return node
}

export const nodeToObj = (node) => {
  console.log('\nU > jsonUtils > objToNodes > node : ', node)
  const nodeType = node.nodeType
  const label = node.label
  console.log('U > jsonUtils > objToNodes > nodeType : ', nodeType)
  let obj
  if (nodeType === 'arr') {
    obj = []
    obj.nodes.forEach(item => {
      console.log('U > jsonUtils > objToNodes > item : ', item)
      obj.push(item)
    })
  }
  if (nodeType === 'obj') {
    obj = {}
    obj[label] = {}
    obj.nodes.forEach(item => {
      console.log('U > jsonUtils > objToNodes > item : ', item)
    })
  }
  return obj
}
