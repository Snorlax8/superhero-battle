import PropTypes from 'prop-types';

function BattleLayout({ clearingBattle, startRound }) {
  return (
    <div className="text begin-battle">
      <div>Para comenzar una ronda, haz click en el botón:</div>
      <button type="button" disabled={clearingBattle} onClick={() => startRound()}>
        Pelear una ronda
      </button>
    </div>
  );
}

BattleLayout.propTypes = {
  clearingBattle: PropTypes.bool.isRequired,
  startRound: PropTypes.func.isRequired,
};

export default BattleLayout;
