import { ToyReact, Component } from './ToyReact.js'

//棋盘方格
class Square extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null
    }
  }
  render() {
    return <button className='square' value={this.props.value} onClick={() => this.props.onClick()}>
      {this.props.value ? this.props.value : ''}
    </button>
  }
}

//棋盘
class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      winner:null,
      dogfall:false,
      squares: Array(9).fill(null),
      isX: Math.random() * 100000 > 50000  //开始玩家随机X或者O
    };
  }
  handleClick(i) {
    //处理方格点击事件
   // console.log('this.state.squares: ', this.state.squares);
    const squares = this.state.squares.slice();
    if (squares[i] !== null || this.state.winner ) return   //已有值的不能再赋值

    squares[i] = this.state.isX ? 'X' : 'O';
    this.setState({
      squares: squares,
      isX: !this.state.isX
    });
    this.calculateWinner(squares)
  }
  calculateWinner(squares) {
    //计算谁赢了
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        this.setState({
          winner: squares[a]
        });
        return squares[a];
      }
    }
    if (!squares.some((i) => !i) && !this.state.winner) {
      this.setState({
        dogfall:true
      })
    }
    return null;
  }
  reset(){
    this.setState({
      winner:null,
      dogfall:false,
      squares: Array(9).fill(null),
      isX: Math.random() * 100000 > 50000 
    });
  }
  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />
  }
  render() {
    return (
      <div>
        <div className='board'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <button onClick={()=>{this.reset()}}>重新开始</button>
        <h2>{this.state.winner? this.state.winner+'获胜' : ''}</h2>
        <h3>{this.state.dogfall? '平局' : ''}</h3>
      </div>
    )
  }
}


ToyReact.render(
  <Board />,
  document.body
)