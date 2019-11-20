import { getUserPoints } from "../Middleware/pointsMiddleware";

class Player {
  //create new user with max points
  constructor(privateId, userId) {
    this.userId = userId;
    this.privateId = privateId;

    this.songPlayedBonus = 2;
    this.votingPenalty = 1;
  }

  getUserPoints() {
    //fetch user who played the song and increment
    return getUserPoints(this.privateId, this.userId);
  }

  getCurrentPoints() {
    return this.points;
  }

  hasReachedMinPoints() {
    return this.points === 0;
  }
}

export default Player;
