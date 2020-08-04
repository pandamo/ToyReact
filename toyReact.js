export class Component {
  constructor() {
    this.children = []
    this.props = Object.create(null) // 创建一个干净的Object
  }
  setAttribute(name, value) {
    this.props[name] = value
    this[name] = value
  }
  mountTo(range) {
    this.range = range
    this.update()
  }
  update() {
    let placeHolder = document.createDocumentFragment()
    let range = document.createRange()
    range.setStart(this.range.endContainer, this.range.endOffset)
    range.setEnd(this.range.endContainer, this.range.endOffset)
    range.insertNode(placeHolder)

    this.range.deleteContents()
    let vDom = this.render()
    vDom.mountTo(this.range)

  }
  appendChild(vChild) {
    this.children.push(vChild)
  }
  setState(state) {
    //更新state
    const merge = (oldState, newState) => {
      for (let i in newState) {
        if (typeof newState[i] === 'object') {
          // 如果是对象，递归下去，最后赋值
          if (typeof oldState[i] !== 'object') {
            oldState[i] = null
          }
          merge(oldState[i], newState[i])
        } else {
          oldState[i] = newState[i]
        }
      }
    }
    if (!this.state && state) {
      this.state = {}
    }

    merge(this.state, state)
    this.update()
  }
}
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    const reg = /^on([\s\S]+)$/ //匹配 onXXXX 参数    \s\S匹配所有字符
    let eventName = name.match(reg) //例：onClick会匹配出 ['onClick','click',...]
    if (eventName) {
      //增加on事件
      eventName = eventName[1].toLowerCase()
      this.root.addEventListener(eventName, value)
    }
    name = name === 'className' ? 'class' : name
    this.root.setAttribute(name, value)
  }
  appendChild(vChild) {
    let range = document.createRange()
    if (this.root.children.length) {
      //如果有子节点，设置在最后的子节点
      range.setStartAfter(this.root.lastChild)
      range.setEndAfter(this.root.lastChild)
    } else {
      //没有子节点这设置在this.root
      range.setStart(this.root, 0)
      range.setEnd(this.root, 0)
    }
    vChild.mountTo(range)
  }
  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  mountTo(range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export const ToyReact = {
  createElement(type, attributes, ...children) {
    let element;

    if (typeof type === 'string') {
      element = new ElementWrapper(type)
    } else {
      // console.log('type: ',new type);
      element = new type //例如type为组件MyComponent，则 new MyComponent
    }

    for (let name in attributes) {
      element.setAttribute(name, attributes[name])
    }

    const insertChild = (children) => {
      for (let child of children) {
        if (typeof child === 'object' && child instanceof Array) {
          insertChild(child)
        } else {
          if (!(child instanceof Component) &&
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper)) {
            child = String(child)
          }
          if (typeof child === 'string') {
            child = new TextWrapper(child)
          }
          element.appendChild(child)
        }
      }
    }
    insertChild(children)

    return element
  },
  render(vdom, element) {
    let range = document.createRange()
    if(element.children.length){
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    }else{
      range.setStart(element,0)
      range.setENd(element,0)
    }
    vdom.mountTo(range)
  }
}