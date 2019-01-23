import React, { Component } from "react";
import axios from "axios";
import "./MiniScoreboard.css";

class MiniScoreboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
  }

  componentDidMount() {
    this.getScores();
  }

  getScores = () => {
    let self = this;
    axios
      .get("http://localhost:8440/api/v1/games")
      .then(function(response) {
        // handle success
        self.setState({ games: response.data.games });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  };

  renderName = (game, side) => {
    let otherSide;
    if (side === "home") {
      otherSide = "away";
    } else {
      otherSide = "home";
    }
    let sideWin;
    if (game.league === "MLB") {
      sideWin =
        game[side + "_batter_totals"].runs >
        game[otherSide + "_batter_totals"].runs;
    } else if (game.league === "NHL") {
      sideWin =
        game[side + "_totals"].goals > game[otherSide + "_totals"].goals;
    } else if (game.league === "NFL" || game.league === "NBA") {
      sideWin =
        game[side + "_totals"].points > game[otherSide + "_totals"].points;
    }
    return (
      <label className={sideWin ? "win" : "loss"}>
        {game[side + "_team"].abbreviation}
      </label>
    );
  };

  renderScores = (game, side) => {
    let otherSide;
    if (side === "home") {
      otherSide = "away";
    } else {
      otherSide = "home";
    }
    if (game.league === "MLB") {
      let sideWin =
        game[side + "_batter_totals"].runs >
        game[otherSide + "_batter_totals"].runs;
      return (
        <div className="boxscore__team__results">
          <span className={sideWin ? "win" : "loss"}>
            {game[side + "_batter_totals"].runs}
          </span>
        </div>
      );
    } else if (game.league === "NBA") {
      let sideWin =
        game[side + "_totals"].points > game[otherSide + "_totals"].points;
      return (
        <div className="boxscore__team__results">
          <span className={sideWin ? "win" : "loss"}>
            {game[side + "_totals"].points}
          </span>
        </div>
      );
    } else if (game.league === "NHL") {
      // DISCLAIMER: not given json object keys for NHL games, so keys/properties below are assumed
      let sideWin =
        game[side + "_totals"].goals > game[otherSide + "_totals"].goals;
      return (
        <div className="boxscore__team__results">
          <span className={sideWin ? "win" : "loss"}>
            {game[side + "_totals"].goals}
          </span>
        </div>
      );
    } else if (game.league === "NFL") {
      // DISCLAIMER: not given json object keys for NFL games, so keys/properties below are assumed
      let sideWin =
        game[side + "_totals"].points > game[otherSide + "_totals"].points;
      return (
        <div className="boxscore__team__results">
          <span className={sideWin ? "win" : "loss"}>
            {game[side + "_totals"].points}
          </span>
        </div>
      );
    }
  };

  renderCurrentPeriod = game => {
    let currentPeriod = 0;
    if (game.event_information.status === "completed") {
      currentPeriod = "Final";
    } else if (game.event_information.status === "scheduled") {
      // DISCLAIMER: above status conditional depends on json status being 'scheduled' if a game has not begun
      let gameTime = new Date(game.event_information.start_date_time);
      currentPeriod = gameTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });
    } else {
      currentPeriod = game.away_period_scores.length;
    }
    if (game.league === "MLB") {
      let inningTopBottom = "";
      if (game.away_period_scores.length > game.home_period_scores.length) {
        inningTopBottom = "Top ";
      } else if (
        game.away_period_scores.length === game.home_period_scores.length &&
        currentPeriod !== "Final"
      ) {
        inningTopBottom = "Btm ";
      }
      return (
        <div className="boxscore__details__info">
          <strong>{`${inningTopBottom}  ${currentPeriod}${this.suffixOf(
            currentPeriod
          )}`}</strong>
        </div>
      );
    } else if (game.league === "NBA") {
      return (
        <div className="boxscore__details__info">
          <strong>
            {currentPeriod}
            {this.suffixOf(currentPeriod)}
          </strong>
        </div>
      );
    }
  };

  suffixOf = i => {
    if (isNaN(i)) {
      return "";
    }
    let j = i % 10;
    let k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  };

  render() {
    return (
      <div class="miniboxscore__container">
        {this.state.games.map((game, i) => {
          /*
          Game
            # periods (int)
            home scores/period (arr)
            away scores/period (arr)
            sport (string)
            home team (string)
            home team abbr (string)
            home team color (string)
            home team record (string)
            away team (string)
            away team abbr (string)
            away team color (string)
            away team record (string)
            if baseball:
              home team hits
              home team errors
              home team runs
              away team hits
              away team errors
              away team runs
          */

          return (
            <div className="miniboxscore" key={i}>
              <div className="miniboxscore__period">{this.renderCurrentPeriod(game)}</div>
              <div>
                <div className="miniboxscore__team">
                  {this.renderName(game, "away")}
                  {this.renderScores(game, "away")}
                </div>
                <div className="miniboxscore__team">
                  {this.renderName(game, "home")}
                  {this.renderScores(game, "home")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default MiniScoreboard;
