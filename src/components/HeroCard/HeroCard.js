import PropTypes from 'prop-types';
import './HeroCard.css';
import DefaultImage from '../../assets/images/major_glory.png';
import HeroInfo from '../HeroInfo/HeroInfo';

const HeroCard = ({ hero, top, teamAlignment }) => {
  const addDefaultImage = event => {
    event.target.src = DefaultImage;
  };

  return (
    <div>
      {top && <HeroInfo hero={hero} teamAlignment={teamAlignment} />}
      <img
        className="avatar"
        src={hero.image.url}
        onError={addDefaultImage}
      ></img>
      {!top && <HeroInfo hero={hero} teamAlignment={teamAlignment} />}
    </div>
  );
};

HeroCard.propTypes = {
  hero: PropTypes.object,
  top: PropTypes.bool,
  teamAlignment: PropTypes.string,
};

export default HeroCard;
