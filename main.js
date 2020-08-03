import {ToyReact,Component} from './toyReact.js'


/* MyComponent组件 */
class MyComponent extends Component{
 render(){
     return <div class='myComponent'>
     {this.children}
    </div>
 }
}

/* AntherComponent组件 */
class AntherComponent extends Component{
    render(){
        return <div class='antherComponent'>
            {this.children}
        </div>
    }
}

let WarrperComponent = <div>
    <h2>我是WarrperComponent</h2>
    <MyComponent>
        {/* 组件嵌套 */}
        <AntherComponent>
            <span>我是 AntherComponent 的 children</span>
        </AntherComponent>
    </MyComponent>
    <AntherComponent></AntherComponent>
</div>

ToyReact.render(
    WarrperComponent,
    document.body
)
