class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild(vChild) {
        vChild.mountTo(this.root)
    }
    mountTo(parent) {
        parent.appendChild(this.root)
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    mountTo(parent) {
        parent.appendChild(this.root)
    }
}


export class Component {
    constructor() {
        this.children = []
    }
    setAttribute(name, value) {
        this[name] = value
    }
    mountTo(parent) {
        let vDom = this.render()
        vDom.mountTo(parent)
    }
    appendChild(vChild) {
        this.children.push(vChild)
    }
}
export const ToyReact = {
    createElement(type, attributes, ...children) {
        let element

        if (typeof type === 'string') {
            element = new ElementWrapper(type)
        } else {
            element = new type // new 组件名称
        }

        for (let name in attributes) {
            element.setAttribute(name, attributes[name])
        }

        let insertChild = (children) => {
            for (let child of children) {
                if (typeof child === 'object' && child instanceof Array) {
                    insertChild(child)
                } else {
                    //处理子元素为非指定的组件(Component,ElementWrapper,TextWrapper)时，转为字符串
                    if (!(child instanceof Component) &&
                        !(child instanceof ElementWrapper) &&
                        !(child instanceof TextWrapper)
                    ) {
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
        vDom.mountTo(element)
    }
}