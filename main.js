import { ToyReact, Component } from './ToyReact.js'


class MyComponent extends Component {
  render() {
    return <div class='MyComponent'>
      <h3>我是MyComponent组件</h3>
      {this.children}
    </div>
  }
}
class SubComponent extends Component {
  render() {
    return <div class='SubComponent'>
      <h3>我是SubComponent组件</h3>
      {this.children}
    </div>
  }
}
const WrapperComponent =
  <div>
    <h2>我叫WrapperComponent</h2>
    {/* MyComponent组件 */}
    <MyComponent id='a' name='a'>
      {/* 组件嵌套 -- MyComponent组件 插入 SubComponent组件 */}    
      <SubComponent><div class='SubComponent-children'>我是SubComponent的children</div></SubComponent>
    </MyComponent>

    {/* SubComponent组件 */}
    <SubComponent></SubComponent>
  </div>

ToyReact.render(
  WrapperComponent,
  document.body
)