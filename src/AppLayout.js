import './App.css';
import Battle from './components/Battle/BattleIndex';
import HeroTeam from './components/HeroTeam/HeroTeam';
import Mail from './components/Mail/MailIndex';
import PropTypes from 'prop-types';
import { getEmojiString } from './utils';

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
}) {
  return (
    <div>
      <div className="App">
        <HeroTeam heroes={teams[0].members} top={true} />
        <div className="text team-name">Equipo 1</div>
        <div>
          <div className="begin-battle-container">
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
          </div>

          {battleEnded && (
            <div className="battle-over-container">
              <div className="text battle-over">¡Batalla finalizada!</div>
              <div className="text">
                Puedes ingresar tu mail para recibir un resumen o comenzar otra
                batalla.
              </div>
              <div className="text header"> Enviar resumen </div>
              <Mail mailBody={mailBody} />
              <div className="text header"> ¿Otra batalla? </div>
              <button className="text" onClick={() => clearBattle()}>
                Comenzar otra batalla
              </button>
            </div>
          )}
        </div>
        <div className="divider">
          <div className="battle-text-container">
            {battleText.map((textObject, index) => (
              <div className={textObject.class} key={index}>
                <span>{getEmojiString(textObject.emojiCode)} </span>
                {textObject.text}
              </div>
            ))}
          </div>
        </div>
        <div className="text team-name">Equipo 2</div>
        <HeroTeam heroes={teams[1].members} top={false} />
      </div>
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
