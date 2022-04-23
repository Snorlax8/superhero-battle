import { useState, useEffect } from 'react';
import './App.css';
import HeroTeam from './components/HeroTeam/HeroTeam';
import { getRandomNumber } from './utils';

function App() {
  const [teams, setTeams] = useState([]);
  const [readyToLoad, setReadyToLoad] = useState(false);

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
      const firstTeam = heroes.slice(0, 5);
      const firstTeamAlignment = getTeamAlignment(firstTeam);

      const secondTeam = heroes.slice(5, 10);
      const secondTeamAlignment = getTeamAlignment(secondTeam);

      setTeams([
        { team: firstTeam, alignment: firstTeamAlignment },
        { team: secondTeam, alignment: secondTeamAlignment },
      ]);
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
    if (teams.length > 0) {
      setReadyToLoad(true);
    }
  }, [teams]);

  useEffect(() => {
    getSuperhero();
  }, []);
  return (
    <div>
      {readyToLoad && (
        <div className="App">
          <HeroTeam
            heroes={teams[0].team}
            top={true}
            teamAlignment={teams[0].alignment}
          />
          <div className="team-name">Equipo 1</div>
          <div className="divider"></div>
          <div className="team-name">Equipo 2</div>
          <HeroTeam
            heroes={teams[1].team}
            top={false}
            teamAlignment={teams[1].alignment}
          />
        </div>
      )}
    </div>
  );
}

export default App;
