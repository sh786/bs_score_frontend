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
      .get("https://barstool-score-burger.herokuapp.com/api/v1/games")
      .then(function(response) {
        // handle success
        self.setState({ games: response.data.games });
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        // always executed
      });
  };

  render() {
    return (
      <div>
        <h2>Stool Scoreboard</h2>
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

          console.log(game);

          let maxPeriod = game.away_period_scores.length;
          // if MLB and we are not over 9 innings, set maxPeriod to 9
          if (game.league === "MLB" && maxPeriod < 9) maxPeriod = 9;
          // if NBA and we are not over 4 quarters, set maxPeriod to 4
          if (game.league === "NBA" && maxPeriod < 4) maxPeriod = 4;

          return (
            <div className="boxscore">
                  <div className="boxscore__team boxscore__team--header">
                  <label></label>
                  <div className="boxscore__team__units">
                    {Array.from(Array(maxPeriod).keys()).map((obj, i) => {
                      return(
                        <span>{i+1}</span>
                      );
                    })}
                  </div>
                  <div className="boxscore__team__results">
                    <span>R</span>
                    <span>H</span>
                    <span>E</span>
                  </div>
                </div>

                {/* <div className="boxscore__team boxscore__team--away">
                  <label>{obj.homeTeam.abbr}</label>
                  <div className="boxscore__team__units">
                    {homeScores.map((period, i) => {
                      currentRuns += period.runs;
                      currentHits += period.hits;
                      currentErrors += period.errors;
                      periodsCounted ++;
                      return (
                        <span>{period.runs}</span>
                      );
                    })}
                  </div>
                  <div className="boxscore__team__results">
                    <span>{currentRuns}</span>
                    <span>{currentHits}</span>
                    <span>{currentErrors}</span>
                  </div>
                </div>
                <div className="boxscore__team boxscore__team--home">
                  <label>{obj.awayTeam.abbr}</label>
                  <div className="boxscore__team__units">
                    {awayScores.map((period, i) => {
                      return (
                        <span>{period.runs}</span>
                      );
                    })}
                  </div>
                  <div className="boxscore__team__results">
                    <span>4</span>
                    <span>8</span>
                    <span>1</span>
                  </div>
                </div>
                <div className="boxscore__details">
                  <div className="boxscore__details__team boxscore__details__team--away">
                    <p>
                      <strong>Cubs</strong><small>CHC</small>
                    </p>
                    <span>56-38</span>
                  </div>
                  <div className="boxscore__details__info">
                    <strong>Btm<br/>9th</strong>
                  </div>
                  <div className="boxscore__details__team boxscore__details__team--home">
                    <p>
                      <strong>Cardinals</strong><small>STL</small>
                    </p>
                    <span>56-38</span>
                  </div>
                </div>
                </div>
          );
        })} */
        {/* {this.state.scores.map((obj, i) => {
                let maxPeriod = obj.currentPeriod;
                let league = obj.league.alias;
                // if MLB and we are not over 9 innings, set maxPeriod to 9
                if (league === 'MLB' && maxPeriod < 9) {
                  maxPeriod = 9;
                }

                let homeScores = obj.homeTeamDetails;
                let awayScores = obj.awayTeamDetails;

                // only matters for MLB
                let currentRuns = 0;
                let currentHits = 0;
                let currentErrors = 0;

                let periodsCounted = 0;
                return (
                  <div className="boxscore">
                  <div className="boxscore__team boxscore__team--header">
                  <label></label>
                  <div className="boxscore__team__units">
                    {Array.from(Array(maxPeriod).keys()).map((obj, i) => {
                      return(
                        <span>{i+1}</span>
                      );
                    })}
                  </div>
                  <div className="boxscore__team__results">
                    <span>R</span>
                    <span>H</span>
                    <span>E</span>
                  </div>
                </div>
                <div className="boxscore__team boxscore__team--away">
                  <label>{obj.homeTeam.abbr}</label>
                  <div className="boxscore__team__units">
                    {homeScores.map((period, i) => {
                      currentRuns += period.runs;
                      currentHits += period.hits;
                      currentErrors += period.errors;
                      periodsCounted ++;
                      return (
                        <span>{period.runs}</span>
                      );
                    })}
                  </div>
                  <div className="boxscore__team__results">
                    <span>{currentRuns}</span>
                    <span>{currentHits}</span>
                    <span>{currentErrors}</span>
                  </div>
                </div>
                <div className="boxscore__team boxscore__team--home">
                  <label>{obj.awayTeam.abbr}</label>
                  <div className="boxscore__team__units">
                    {awayScores.map((period, i) => {
                      return (
                        <span>{period.runs}</span>
                      );
                    })}
                  </div>
                  <div className="boxscore__team__results">
                    <span>4</span>
                    <span>8</span>
                    <span>1</span>
                  </div>
                </div>
                <div className="boxscore__details">
                  <div className="boxscore__details__team boxscore__details__team--away">
                    <p>
                      <strong>Cubs</strong><small>CHC</small>
                    </p>
                    <span>56-38</span>
                  </div>
                  <div className="boxscore__details__info">
                    <strong>Btm<br/>9th</strong>
                  </div>
                  <div className="boxscore__details__team boxscore__details__team--home">
                    <p>
                      <strong>Cardinals</strong><small>STL</small>
                    </p>
                    <span>56-38</span>
                  </div>
                  </div>*/ }
                </div>
                );
              })
        }
      </div>
    );
  }
}

export default Scoreboard;
