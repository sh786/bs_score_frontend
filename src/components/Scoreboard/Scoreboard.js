import React, { Component } from "react";
import axios from "axios";
import "./Scoreboard.css";

class Scoreboard extends Component {
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

  renderPeriodUnits = game => {
    if (game.league === "MLB") {
      return (
        <div className="boxscore__team__units">
          {Array.from(Array(game.maxPeriod).keys()).map((obj, i) => {
            return <span key={i}>{i + 1}</span>;
          })}
        </div>
      );
    } else if (
      game.league === "NBA" ||
      game.league === "NFL" ||
      game.leauge === "NHL"
    ) {
      return (
        <div className="boxscore__team__units">
          {Array.from(Array(game.maxPeriod).keys()).map((obj, i) => {
            if (i === 4) {
              return <span key={i}>OT</span>;
            }
            if (i > 4) {
              return <span key={i}>{i - 3}OT</span>;
            }
            return <span key={i}>{i + 1}</span>;
          })}
        </div>
      );
    }
  };

  renderEndUnits = game => {
    if (game.league === "MLB") {
      return (
        <div className="boxscore__team__results">
          <span>R</span>
          <span>H</span>
          <span>E</span>
        </div>
      );
    } else {
      return (
        <div className="boxscore__team__results">
          <span>T</span>
        </div>
      );
    }
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
          <span className={sideWin ? "win" : "loss"}>
            {game[side + "_batter_totals"].hits}
          </span>
          <span className={sideWin ? "win" : "loss"}>
            {game[side + "_errors"]}
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
      <div>
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

          game.maxPeriod = game.away_period_scores.length;
          // if MLB and we are not over 9 innings, set maxPeriod to 9
          if (game.league === "MLB" && game.maxPeriod < 9) game.maxPeriod = 9;
          // if NBA and we are not over 4 quarters, set maxPeriod to 4
          if (game.league === "NBA" && game.maxPeriod < 4) game.maxPeriod = 4;

          return (
            <div className="boxscore" key={i}>
              <div className="boxscore__team boxscore__team--header">
                <label />
                {this.renderPeriodUnits(game)}
                {this.renderEndUnits(game)}
              </div>
              <div className="boxscore__team boxscore__team--away">
                {this.renderName(game, "away")}
                <div className="boxscore__team__units">
                  {game.away_period_scores.map((score, i) => {
                    return <span key={i}>{score}</span>;
                  })}
                </div>
                {this.renderScores(game, "away")}
              </div>
              <div className="boxscore__team boxscore__team--home">
                {this.renderName(game, "home")}
                <div className="boxscore__team__units">
                  {game.home_period_scores.map((score, i) => {
                    return <span key={i}>{score}</span>;
                  })}
                </div>
                {this.renderScores(game, "home")}
              </div>
              <div className="boxscore__details">
                <div className="boxscore__details__team boxscore__details__team--away">
                  <p>
                    <strong>{game.away_team.last_name}</strong>
                    <small>{game.away_team.abbreviation}</small>
                  </p>
                </div>
                {this.renderCurrentPeriod(game)}
                <div className="boxscore__details__team boxscore__details__team--home">
                  <p>
                    <strong>{game.home_team.last_name}</strong>
                    <small>{game.home_team.abbreviation}</small>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Scoreboard;
