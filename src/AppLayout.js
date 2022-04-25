import './App.css';
import Battle from './components/Battle/BattleIndex';
import HeroTeam from './components/HeroTeam/HeroTeam';
import Mail from './components/Mail/MailIndex';
import PropTypes from 'prop-types';

function App({
  teams,
  setTeams,
  battleEnded,
  setBattleEnded,
  battleText,
  setBattleText,
  round,
  setRound,
  clearingBattle,
  setMailBody,
  mailBody,
  clearBattle,
  getEmojiString,
}) {
  return (
    <div>
      <div className="App">
        <HeroTeam heroes={teams[0].members} top={true} />
        <div className="team-name">Equipo 1</div>
        <div className="begin-battle-container">
          <div>
            {!battleEnded && (
              <Battle
                setBattleEnded={setBattleEnded}
                battleText={battleText}
                setBattleText={setBattleText}
                round={round}
                setRound={setRound}
                teams={teams}
                setTeams={setTeams}
                clearingBattle={clearingBattle}
                setMailBody={setMailBody}
              />
            )}
            <div className="begin-battle"></div>
            <div>
              {battleEnded && (
                <div>
                  La batalla terminó. Puedes ingresar tu mail para recibir un
                  resumen o comenzar otra batalla.
                  <Mail mailBody={mailBody} />
                  <button onClick={() => clearBattle()}>
                    Comenzar otra batalla
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="divider">
          {battleText.map((textObject, index) => (
            <div key={index}>
              <span>{getEmojiString(textObject.emojiCode)} </span>
              {textObject.text}
            </div>
          ))}
        </div>
        <div className="team-name">Equipo 2</div>
        <HeroTeam heroes={teams[1].members} top={false} />
      </div>
      {/* )} */}
    </div>
  );
}

App.propTypes = {
  teams: PropTypes.array,
  setTeams: PropTypes.func,
  battleEnded: PropTypes.bool,
  setBattleEnded: PropTypes.func,
  battleText: PropTypes.array,
  setBattleText: PropTypes.func,
  round: PropTypes.number,
  setRound: PropTypes.func,
  clearingBattle: PropTypes.bool,
  setMailBody: PropTypes.func,
  mailBody: PropTypes.string,
  clearBattle: PropTypes.func,
  getEmojiString: PropTypes.func,
};

export default App;
