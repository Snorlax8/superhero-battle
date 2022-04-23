import { useState, useEffect } from 'react';
import './App.css';
import HeroTeam from './components/HeroTeam/HeroTeam';
import { getRandomNumber } from './utils';

function App() {
  const [firstTeam, setFirstTeam] = useState([]);
  const [firstTeamAlignment, setFirstTeamAlignment] = useState('');
  const [secondTeam, setSecondTeam] = useState([]);
  const [secondTeamAlignment, setSecondTeamAlignment] = useState('');

  const getHeroIds = () => {
    var heroIds = new Set();
    while (heroIds.size !== 10) {
      heroIds.add(getRandomNumber(731));
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

  const getTeamAlignment = team => {
    var goodCount = 0;
    var badCount = 0;
    team.forEach(member => {
      if (member.biography.alignment === 'bad') {
        badCount += 1;
      } else {
        goodCount += 1;
      }
    });
    return goodCount >= badCount ? 'good' : 'bad';
  };

  useEffect(() => {
    if (firstTeam.length > 0) {
      setFirstTeamAlignment(getTeamAlignment(firstTeam));
    }
  }, [firstTeam]);

  useEffect(() => {
    if (secondTeam.length > 0) {
      setSecondTeamAlignment(getTeamAlignment(secondTeam));
    }
  }, [secondTeam]);

  useEffect(() => {
    getSuperhero();
  }, []);
  return (
    <div className="App">
      <HeroTeam
        heroes={firstTeam}
        top={true}
        teamAlignment={firstTeamAlignment}
      />
      <div className="team-name">Equipo 1</div>
      <div className="divider"></div>
      <div className="team-name">Equipo 2</div>
      <HeroTeam
        heroes={secondTeam}
        top={false}
        teamAlignment={secondTeamAlignment}
      />
    </div>
  );
}

export default App;
