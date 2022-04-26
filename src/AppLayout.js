import './App.css';
import PropTypes from 'prop-types';
import Battle from './components/Battle/BattleIndex';
import HeroTeam from './components/HeroTeam/HeroTeam';
import Mail from './components/Mail/MailIndex';
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
        <HeroTeam heroes={teams[0].members} top />
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
              <div className="new-battle-buttons">
                <button type="button" className="text" onClick={() => clearBattle(false)}>
                  Comenzar otra batalla con los mismos héroes
                </button>
                <button type="button" className="text" onClick={() => clearBattle(true)}>
                  Comenzar otra batalla con héroes diferentes
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="divider">
          <div className="battle-text-container">
            {battleText.map((textObject, index) => (
              <div className={textObject.class} key={index}>
                <span>
                  {getEmojiString(textObject.emojiCode)}
                  {' '}
                </span>
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
  teams: PropTypes.instanceOf(Array).isRequired,
  setTeams: PropTypes.func.isRequired,
  battleEnded: PropTypes.bool.isRequired,
  setBattleEnded: PropTypes.func.isRequired,
  battleText: PropTypes.instanceOf(Array).isRequired,
  setBattleText: PropTypes.func.isRequired,
  round: PropTypes.number.isRequired,
  setRound: PropTypes.func.isRequired,
  clearingBattle: PropTypes.bool.isRequired,
  setMailBody: PropTypes.func.isRequired,
  mailBody: PropTypes.string.isRequired,
  clearBattle: PropTypes.func.isRequired,
};

export default App;
