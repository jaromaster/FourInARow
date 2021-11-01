import './App.css';
import GameBody from './Components/Game/GameBody';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* headline */}
        <h1 id="gameHeadline">Four In A Row</h1>
        
        {/* game's body */}
        <GameBody />
      </header>
    </div>
  );
}

export default App;
