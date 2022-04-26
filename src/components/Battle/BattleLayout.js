import PropTypes from 'prop-types';

const BattleLayout = ({ clearingBattle, startRound }) => {
  return (
    <div className="text begin-battle">
      <div>Para comenzar una ronda, haz click en el botón:</div>
      <button disabled={clearingBattle} onClick={() => startRound()}>
        Pelear una ronda
      </button>
    </div>
  );
};

BattleLayout.propTypes = {
  clearingBattle: PropTypes.bool,
  startRound: PropTypes.func,
};

export default BattleLayout;
