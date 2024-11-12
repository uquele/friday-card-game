# Friday (1-player card game)

### The game & rules

Rules (PDF): https://www.riograndegames.com/wp-content/uploads/2013/02/Friday.pdf  
Official website: https://www.riograndegames.com/games/friday/  
BoardGameGeek: https://boardgamegeek.com/boardgame/43570/friday  

### How to launch the game

1. Download and install [node.js](https://nodejs.org/)
2. Download all files from this repository
3. Open "backend" folder
4. Run "npm start" in terminal

### About this version

This is a playable web version of the game made by a student studying programming (hire me!).  
I hope you enjoy it, even though there are some minor bugs (see todo.txt)

### Development

When creating this version, I had in mind the following ideas:
- use as few dependencies as possible (for learning purposes)
- separate UI from game logic (helps in debugging and to introduce new features / game mechanics)
- allow for custom cards (do not use images for cards: all cards must be html elements which can be changed)
- create functions as game actions (to make the code easier to follow when implementing the rules of the game)
- focus on game logic and fuctionality instead of design

Frontend:
- vanilla javascript
- no frameworks
- no external dependecies

Backend:
- nodejs
- express

