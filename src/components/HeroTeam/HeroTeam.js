import PropTypes from 'prop-types';
import HeroCard from '../HeroCard/HeroCard';

import './HeroTeam.css';

const HeroTeam = ({ heroes, top }) => {
  return (
    <div className="hero-row">
      {heroes.map(hero => (
        <HeroCard key={hero.id} hero={hero} top={top} />
      ))}
    </div>
  );
};

HeroTeam.propTypes = {
  heroes: PropTypes.array,
  top: PropTypes.bool,
};

export default HeroTeam;
