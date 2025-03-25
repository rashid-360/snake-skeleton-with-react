import React, { useRef, useEffect, useState } from 'react';

const Canvas = () => {
  const [snake, setSnake] = useState([325, 326, 327, 328]);
  const [direction, setDirection] = useState(1);
  const [mouse, setMouse] = useState(null);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  const GRID_SIZE = 50;
  const CELL_SIZE = 20;
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 800;

  const generateMousePosition = (excludedPositions) => {
    let newPosition;
    do {
      newPosition = Math.floor(Math.random() * (CANVAS_WIDTH / CELL_SIZE * CANVAS_HEIGHT / CELL_SIZE));
    } while (excludedPositions.includes(newPosition));
    return newPosition;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Ensure mouse is initialized
    if (mouse === null) {
      setMouse(generateMousePosition(snake));
      return;
    }

    const draw = (ctx, index, color = '#FFFFFF') => {
      if (index === null || index === undefined) return;
      
      ctx.fillStyle = color;
      const x = (index % GRID_SIZE) * CELL_SIZE;
      const y = Math.floor(index / GRID_SIZE) * CELL_SIZE;
      ctx.fillText(index.toString(), x, y);
    };

    const clearCanvas = (ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
    };

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          if (direction !== -GRID_SIZE) setDirection(GRID_SIZE);
          break;
        case 'ArrowUp':
          if (direction !== GRID_SIZE) setDirection(-GRID_SIZE);
          break;
        case 'ArrowRight':
          if (direction !== -1) setDirection(1);
          break;
        case 'ArrowLeft':
          if (direction !== 1) setDirection(-1);
          break;
      }
    };

    const updateGame = () => {
      if (gameOver || mouse === null) return;

      setSnake(prevSnake => {
        const newHead = prevSnake[prevSnake.length - 1] + direction;
        
        const currentRow = Math.floor(prevSnake[prevSnake.length - 1] / GRID_SIZE);
        const newRow = Math.floor(newHead / GRID_SIZE);
        
        if (
          newHead < 0 || 
          newHead >= CANVAS_WIDTH / CELL_SIZE * CANVAS_HEIGHT / CELL_SIZE ||
          (direction === 1 && currentRow !== newRow) ||
          (direction === -1 && currentRow !== newRow) ||
          prevSnake.includes(newHead)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Mouse eating logic
        if (newHead === mouse) {
          setPoints(prev => prev + 1);
          setMouse(generateMousePosition([...prevSnake, newHead]));
          return [...prevSnake, newHead];
        }

        return [...prevSnake.slice(1), newHead];
      });
    };

    clearCanvas(context);
    
    snake.forEach(segment => {
      if (segment !== null && segment !== undefined) {
        draw(context, segment);
      }
    });

    if (mouse !== null && mouse !== undefined) {
      draw(context, mouse, '#FF0000');
    }

    const gameInterval = setInterval(updateGame, 100);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [snake, mouse, direction, gameOver]);

  const restartGame = () => {
    setSnake([325, 326, 327, 328]);
    setDirection(1);
    setPoints(0);
    setGameOver(false);
    setMouse(null);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <canvas ref={canvasRef} />
    <div style={{ marginLeft: '20px' }}>
      <h3>Snake Segments:</h3>
      {snake.map((segment, index) => (
        <div key={index}>
          Segment {index + 1}: {segment}
        </div>
      ))}
      <div>Points: {points}</div>
      {gameOver && (
        <div>
          <p>Game Over!</p>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  </div>
  );
};

export default Canvas;