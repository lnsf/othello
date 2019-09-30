class COMPlayer {
  constructor(comTurnIsBlack) {
    this.comTurnIsBlack = comTurnIsBlack;

    this.priorities = [
      100, -1, 50, 50, 50, 50, -1, 100,
      -1, -1, 10, 10, 10, 10, -1, -1,
      10, 5, 5, 5, 5, 5, 5, 10,
      30, 3, 3, 3, 3, 3, 3, 30,
      30, 3, 3, 3, 3, 3, 3, 30,
      10, 5, 5, 5, 5, 5, 5, 10,
      -1, -1, 10, 10, 10, 10, -1, -1,
      100, -1, 50, 50, 50, 50, -1, 100
    ];
  }

  placeStone(placeablePlaces) {
    let place = {
      priority: -2,
      index: -1
    };
    if (placeablePlaces.length === 0)
      return null;

    placeablePlaces.forEach((i) => {
      if (place.priority < this.priorities[i])
        place = {
          priority: this.priorities[i],
          index: i
        }
    });
    return place.index;
  }
}

export default COMPlayer;
