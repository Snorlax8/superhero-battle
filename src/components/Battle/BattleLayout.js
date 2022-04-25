import PropTypes from 'prop-types';

const BattleLayout = ({ clearingBattle, startRound }) => {
  return (
    <div className="begin-battle">
      Para comenzar una ronda, haz click en el botón:
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
