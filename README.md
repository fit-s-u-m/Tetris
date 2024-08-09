# Tetris Game
## Description
A classic Tetris game implemented using Pixi.js. 
This project was developed as part of an internship program at Qene Games. 
The game includes traditional Tetris gameplay mechanics such as rotating and moving tetrominoes, clearing lines, and increasing difficulty levels.
The game also includes a scoring system that rewards players for clearing lines and a level system that increases the speed of the tetrominoes as the player progresses.Also added hard drop feature to the game. 
The game use super rotation System ([SRS](https://harddrop.com/wiki/SRS)) so you can do T-spin and other advanced moves.

## Installation
1. **Clone the repository:**
   ```bash
     git clone https://github.com/Qene-Internship/tetris-fitsum.git
   ```
2. **Navigate to the project directory:**
   ```bash
     cd tetris-fitsum
   ```
3. **Install dependencies:**
   ```bash
     bun install
   ```
   if you haven't yet installed bun [install it](https://bun.sh/docs/installation)
4. **run the game**
   ```bash
   bun run dev
   ```
## How to Play
-  Use the arrow keys to move and rotate the tetrominoes.
   - **Arrow left** and Arrow right  to move the block side to side
   - **Arrow up** to rotate the tetromino
   - **Arrow dowm** to increase the speed to move
   - **Space** to hard drop the tetromino
   - **P** to pause the game
   - **Z** to rotate the tetromino counter clockwise
   - **X** to rotate the tetromino clockwise
-  If you are a vim user and hate the arrow keys 
   - **h** and **l**  to move the block side to side
   - **k** to rotate the tetromino
   - **j** to increase the speed to move
-  Fill a row completely to clear it and earn points.
- The game ends when the tetrominoes stack up to the top of the playing field.
## Preview



![Screenshot Of the Game](https://github.com/user-attachments/assets/3c66bc1c-4853-4969-afd2-14447b4bad77)

[![simple video of playing it](https://github.com/user-attachments/assets/3c66bc1c-4853-4969-afd2-14447b4bad77)](https://github.com/user-attachments/assets/81c0368b-a768-4b62-bfb0-6a332ec54ab1)

Showing when it is Game Over

[![simple video of showing game over](https://github.com/user-attachments/assets/3c66bc1c-4853-4969-afd2-14447b4bad77)](https://github.com/user-attachments/assets/9e5576f6-3a87-4681-880f-076f282dea91)





## Technologies Used
- Konva.js: For rendering graphics
- Typescript: Game logic
- HTML/CSS: Interface and styling
- bun: For development server and dependency management
