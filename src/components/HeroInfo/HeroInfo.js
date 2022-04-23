import PropTypes from 'prop-types';
import './HeroInfo.css';
import { getRandomNumber } from '../../utils';

const HeroInfo = ({ hero, teamAlignment }) => {
  const processStat = stat => {
    if (stat && stat !== 'null') return parseInt(stat, 10);
    else return getRandomNumber(100);
  };
  var heroStats = {
    intelligence: processStat(hero.powerstats.intelligence),
    strength: processStat(hero.powerstats.strength),
    speed: processStat(hero.powerstats.speed),
    durability: processStat(hero.powerstats.durability),
    power: processStat(hero.powerstats.power),
    combat: processStat(hero.powerstats.combat),
  };

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
      <div>IN: {getActualStat(heroStats.intelligence)}</div>
      <div>STR: {getActualStat(heroStats.strength)}</div>
      <div>SP: {getActualStat(heroStats.speed)}</div>
      <div>DRB: {getActualStat(heroStats.durability)}</div>
      <div>PWR: {getActualStat(heroStats.power)}</div>
      <div>CBT: {getActualStat(heroStats.combat)}</div>
    </div>
  );
};

HeroInfo.propTypes = {
  hero: PropTypes.object,
  teamAlignment: PropTypes.string,
};

export default HeroInfo;
