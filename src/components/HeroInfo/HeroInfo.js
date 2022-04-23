import PropTypes from 'prop-types';
import './HeroInfo.css';
import { getRandomNumber } from '../../utils';

const HeroInfo = ({ hero, teamAlignment }) => {
  const getFiliationCoefficient = () => {
    const modifier = 1 + getRandomNumber(9);
    const heroAlignment = hero.biography.alignment;
    return heroAlignment === teamAlignment ? modifier : modifier ** -1;
  };

  const getActualStamina = () => {
    return getRandomNumber(10);
  };

  const getActualStat = baseStat => {
    const actualStamina = getActualStamina();
    const modifiedBaseStat = 2 * baseStat + actualStamina;
    const fb = getFiliationCoefficient();
    return Math.round((fb * modifiedBaseStat) / 1.1);
  };

  return (
    <div className="hero-info">
      <div>{hero.name}</div>
      <div>
        IN: {hero.powerstats.intelligence},{' '}
        {getActualStat(hero.powerstats.intelligence)}
      </div>
      <div>
        STR: {hero.powerstats.strength},{' '}
        {getActualStat(hero.powerstats.strength)}
      </div>
      <div>
        SP: {hero.powerstats.speed}, {getActualStat(hero.powerstats.speed)}
      </div>
      <div>
        DRB: {hero.powerstats.durability},{' '}
        {getActualStat(hero.powerstats.durability)}
      </div>
      <div>
        PWR: {hero.powerstats.power}, {getActualStat(hero.powerstats.power)}
      </div>
      <div>
        CBT: {hero.powerstats.combat}, {getActualStat(hero.powerstats.combat)}
      </div>
    </div>
  );
};

HeroInfo.propTypes = {
  hero: PropTypes.object,
  teamAlignment: PropTypes.string,
};

export default HeroInfo;
