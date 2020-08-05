export class Component {
  constructor() {
    this.children = []
    this.props = Object.create(null) // 创建一个干净的Object
  }
  get type(){
    return this.constructor.name
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
    //对比 type 、props、children
    let vDom = this.vDom
    if(this.oldVdom){
      let isSameNode =(node1,node2)=>{
        if(node1.type != node2.type) return false   //type不相等
        if(Object.keys(node1.props).length !=Object.keys(node2.props).length) return false // props的长度不相等
        for(let name in node1.props){          
          if(
            typeof node1.props[name] === 'object' 
            && typeof node2.props[name] === 'object'
            && JSON.stringify(node1.props[name]) === JSON.stringify(node2.props[name])
          ){
            continue
          }
          if(node1.props[name]!==node2.props[name]) return false  //props具体项不相等
        }

        return true
      }
      let isSameTree =(node1,node2)=>{
        if(!isSameNode(node1,node2)) return false
        if(node1.children.length !==node2.children.length) return false //children数量不相等

        for(let i=0;i<node1.children.length;i++){
          if(!isSameTree(node1.children[i],node2.children[i])) return false
        }
        return true
      }

      let replace = (newTree,oldTree)=>{
        if(isSameTree(newTree,oldTree)) return  //没变化，无需更新操作
        if(!isSameNode(newTree,oldTree)){
          // type、props一致，children不一致，直接更新
          newTree.mountTo(oldTree.range)
        }else{
          for(let i=0;i<newTree.children.length;i++){
            replace(newTree.children[i],oldTree.children[i])
          }
        }
      }

      replace(vDom,this.oldVdom)

    }else{
      vDom.mountTo(this.range)
    }
    this.oldVdom = vDom
  }
  get vDom(){
    return this.render().vDom
  }
  appendChild(vChild) {
    this.children.push(vChild)
  }
  setState(state) {
    //更新state
    const merge = (oldState, newState) => {
      for (let i in newState) {
        if (typeof newState[i] === 'object' && newState[i] !== null) {
          // 如果是对象，递归下去，最后赋值
          if (typeof oldState[i] !== 'object' ) {
            if(newState[i] instanceof Array){
              oldState[i]=[]
            }else{
              oldState[i] = {}
            }
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
    this.type=type
    this.props=Object.create(null)
    this.children=[]
  }
  setAttribute(name, value) {
    this.props[name]=value
  }
  appendChild(vChild) {
   this.children.push(vChild)
  }
  get vDom(){
    return this
  }
  mountTo(range) {
    this.range = range
    let placeHolder = document.createComment('placeHolder')
    let endRange =document.createRange()
    endRange.setStart(range.endContainer,range.endOffset)
    endRange.setEnd(range.endContainer,range.endOffset)
    endRange.insertNode(placeHolder)

    range.deleteContents()
    
    let element = document.createElement(this.type)

    const reg = /^on([\s\S]+)$/ //匹配 onXXXX 参数    \s\S匹配所有字符

    for(let name in this.props){
      let propsValue=this.props[name]
      let eventName = name.match(reg) //例：onClick会匹配出 ['onClick','click',...]
      if (eventName) {
        //增加on监听事件
        eventName = eventName[1].toLowerCase()
        element.addEventListener(eventName, propsValue)
      }

      name = name === 'className' ? 'class' : name    
      element.setAttribute(name,propsValue)
    }
    for(let child of this.children){
      let range = document.createRange()
      if (element.children.length) {
        //如果有子节点，设置在最后的子节点
        range.setStartAfter(element.lastChild)
        range.setEndAfter(element.lastChild)
      } else {
        //没有子节点这设置在this.root
        range.setStart(element, 0)
        range.setEnd(element, 0)
      }
      child.mountTo(range)
    }
    range.insertNode(element)
  }
}
class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
    this.type = '#text'
    this.children = []
    this.props= Object.create(null)
  }
  mountTo(range) {
    this.range = range
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
          if(child === null && child === void 0){
            child = ''
          }
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
  render(vDom, element) {
    let range = document.createRange()
    if(element.children.length){
      range.setStartAfter(element.lastChild)
      range.setEndAfter(element.lastChild)
    }else{
      range.setStart(element,0)
      range.setENd(element,0)
    }
    vDom.mountTo(range)
  }
}