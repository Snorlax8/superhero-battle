import { useState, useEffect } from 'react';
import './App.css';
import HeroTeam from './components/HeroTeam/HeroTeam';

function App() {
  const [firstTeam, setFirstTeam] = useState([]);
  const [secondTeam, setSecondTeam] = useState([]);

  const getHeroIds = () => {
    var heroIds = new Set();
    while (heroIds.size !== 10) {
      heroIds.add(Math.floor(Math.random() * 731));
    }
    return heroIds;
  };

  const getSuperhero = async () => {
    try {
      const heroIds = [...getHeroIds()];
      const heroes = [];
      await Promise.all(
        heroIds.map(async id => {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL, {
            headers: { 'Content-Type': 'application/json' },
            method: 'post',
            body: JSON.stringify({ id }),
          });
          const data = await response.json();
          heroes.push(data);
        })
      );
      setFirstTeam(heroes.slice(0, 5));
      setSecondTeam(heroes.slice(5, 10));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getSuperhero();
  }, []);

  return (
    <div className="App">
      <HeroTeam heroes={firstTeam} top={true} />
      <div className="team-name">Equipo 1</div>
      <div className="divider"></div>
      <div className="team-name">Equipo 2</div>
      <HeroTeam heroes={secondTeam} top={false} />
    </div>
  );
}

export default App;
