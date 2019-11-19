import { getUserPoints, updatePoints } from "../Middleware/pointsMiddleware";
import { getAllUsers } from "../Middleware/userMiddleware";

class Player {
  //create new user with max points
  constructor(privateId, userId) {
    this.userId = userId;
    this.privateId = privateId;

    this.songPlayedBonus = 2;
    this.votingPenalty = 1;
  }

  vote() {
    console.log(
      "private id and user id in interface :",
      this.privateId,
      this.userId
    );
    //update current user's points and decrement by 1
    return getUserPoints(this.privateId, this.userId);
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
