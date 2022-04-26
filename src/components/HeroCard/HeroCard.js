import PropTypes from 'prop-types';
import './HeroCard.css';
import DefaultImage from '../../assets/images/major_glory.png';
import HeroInfo from '../HeroInfo/HeroInfo';

function HeroCard({ hero, top }) {
  const addDefaultImage = (event) => {
    // eslint-disable-next-line no-param-reassign
    event.target.src = DefaultImage;
  };

  return (
    <div>
      {top && <HeroInfo hero={hero} />}
      <img
        alt="hero-avatar"
        className={`avatar ${hero.hp > 0 ? '' : 'avatar-dead'}`}
        src={hero.image.url}
        onError={addDefaultImage}
      />
      {!top && <HeroInfo hero={hero} />}
    </div>
  );
}

HeroCard.propTypes = {
  hero: PropTypes.instanceOf(Object).isRequired,
  top: PropTypes.bool.isRequired,
};

export default HeroCard;
