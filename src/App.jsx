import { useCallback, useEffect, useState } from "react";
import blank from './images/blank.png';
import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';
import ScoreBoard from "./ScoreBoard";

const width = 8;
const candyColors = [
  blueCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
  greenCandy
];

export default function App() {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const createBoard = useCallback(() => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  }, []);
  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(value => value + 3);
        columnOfThree.forEach(num => currentColorArrangement[num] = blank);
        return true;
      }
    }
  }, [currentColorArrangement]);
  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(value => value + 4);
        columnOfFour.forEach(num => currentColorArrangement[num] = blank);
        return true;
      }
    }
  }, [currentColorArrangement]);
  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      const isBlank = currentColorArrangement[i] === blank;
      if (notValid.includes(i)) continue;
      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(value => value + 3);
        rowOfThree.forEach(num => currentColorArrangement[num] = blank);
        return true;
      }
    }
  }, [currentColorArrangement]);
  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
      const isBlank = currentColorArrangement[i] === blank;
      if (notValid.includes(i)) continue;
      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(value => value + 4);
        rowOfFour.forEach(num => currentColorArrangement[num] = blank);
        return true;
      }
    }
  }, [currentColorArrangement]);
  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(candyColors.length * Math.random());
        currentColorArrangement[i] = candyColors[randomNumber];
      }
      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  }, [currentColorArrangement]);

  useEffect(() => {
    createBoard();
  }, [createBoard]);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForColumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100)

    return () => clearInterval(timer);
  }, [checkForColumnOfFour, checkForColumnOfThree, checkForRowOfFour, checkForRowOfThree, currentColorArrangement, moveIntoSquareBelow])
 
  return (
    <div className="app">
      <button onClick={() => window.location.reload()}>New Game</button>
      <div className="game">
        {currentColorArrangement.map((candyColor, ind) => (
          <img
            key={ind} 
            data-id={ind} 
            draggable 
            onDragOver={e => e.preventDefault()} 
            onDragEnter={e => e.preventDefault()} 
            onDragLeave={e => e.preventDefault()}
            onDrop={(e) => {
              setSquareBeingReplaced(e.target);
            }}
            onDragStart={(e) => {
              setSquareBeingDragged(e.target);
            }}
            onDragEnd={() => {
              const replacedId = parseInt(squareBeingReplaced.getAttribute("data-id"));
              const draggedId = parseInt(squareBeingDragged.getAttribute("data-id"));
              currentColorArrangement[replacedId] = squareBeingDragged.getAttribute("src");
              currentColorArrangement[draggedId] = squareBeingReplaced.getAttribute("src");
              const validMoves = [draggedId - 1, draggedId - width, draggedId + 1, draggedId + width];
              const validMove = validMoves.includes(replacedId);
              const isAColumnOfFour = checkForColumnOfFour();
              const isAColumnOfThree = checkForColumnOfThree();
              const isARowOfFour = checkForRowOfFour();
              const isARowOfThree = checkForRowOfThree();
              if (replacedId && validMove && (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
                setSquareBeingDragged(null);
                setSquareBeingReplaced(null);
              } else {
                currentColorArrangement[replacedId] = squareBeingReplaced.getAttribute("src");
                currentColorArrangement[draggedId] = squareBeingDragged.getAttribute("src");
                setCurrentColorArrangement([...currentColorArrangement]);
              }
            }}
            src={candyColor}
            alt=""
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  )
}