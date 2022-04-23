import PropTypes from 'prop-types';
import './HeroInfo.css';

const HeroInfo = ({ hero }) => {
  return (
    <div className="hero-info">
      <div>{hero.name}</div>
      <div>IN: {hero.powerstats.intelligence}</div>
      <div>STR: {hero.powerstats.strength}</div>
      <div>SP: {hero.powerstats.speed}</div>
      <div>DRB: {hero.powerstats.durability}</div>
      <div>PWR: {hero.powerstats.power}</div>
      <div>CBT: {hero.powerstats.combat}</div>
    </div>
  );
};

HeroInfo.propTypes = {
  hero: PropTypes.object,
};

export default HeroInfo;
