import PropTypes from 'prop-types';
import './HeroInfo.css';

function HeroInfo({ hero }) {
  return (
    <div className="hero-info">
      <div className="hero-name">{hero.name}</div>
      <div>
        <span className="stat-name">IN:</span>
        {' '}
        {hero.powerstats.intelligence}
      </div>
      <div>
        <span className="stat-name">STR:</span>
        {' '}
        {hero.powerstats.strength}
      </div>
      <div>
        <span className="stat-name">SP:</span>
        {' '}
        {hero.powerstats.speed}
      </div>
      <div>
        <span className="stat-name">DRB:</span>
        {' '}
        {hero.powerstats.durability}
      </div>
      <div>
        <span className="stat-name">PWR:</span>
        {' '}
        {hero.powerstats.power}
      </div>
      <div>
        <span className="stat-name">CBT:</span>
        {' '}
        {hero.powerstats.combat}
      </div>
      <div className={hero.hp > 0 ? 'hp-alive' : 'hp-dead'}>
        <span className="stat-name">HP:</span>
        {' '}
        {hero.hp}
      </div>
    </div>
  );
}

HeroInfo.propTypes = {
  hero: PropTypes.instanceOf(Object).isRequired,
};

export default HeroInfo;
