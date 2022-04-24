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

  const processHeroStat = stat => {
    if (stat && stat !== 'null') {
      return parseInt(stat, 10);
    } else {
      return getRandomNumber(100);
    }
  };

  const getActualStamina = () => {
    return getRandomNumber(10);
  };

  const getFiliationCoefficient = (heroAlignment, teamAlignment) => {
    const modifier = 1 + getRandomNumber(9);
    return heroAlignment === teamAlignment ? modifier : modifier ** -1;
  };

  const getActualStat = (
    baseStat,
    heroActualStamina,
    heroAlignment,
    teamAlignment
  ) => {
    const modifiedBaseStat = 2 * baseStat + heroActualStamina;
    const fb = getFiliationCoefficient(heroAlignment, teamAlignment);
    return Math.round((fb * modifiedBaseStat) / 1.1);
  };

  const processHeroData = data => {
    var heroStats = {
      intelligence: processHeroStat(data.powerstats.intelligence),
      strength: processHeroStat(data.powerstats.strength),
      speed: processHeroStat(data.powerstats.speed),
      durability: processHeroStat(data.powerstats.durability),
      power: processHeroStat(data.powerstats.power),
      combat: processHeroStat(data.powerstats.combat),
    };
    return {
      id: data.id,
      image: data.image,
      name: data.name,
      powerstats: heroStats,
      alignment: data.biography.alignment,
      actualStamina: getActualStamina(),
    };
  };

  const getHeroHP = hero => {
    const actualStaminaModifier = 1 + hero.actualStamina / 10;
    const statsCombination =
      (hero.powerstats.strength * 0.8 +
        hero.powerstats.durability * 0.7 +
        hero.powerstats.power) /
      2;
    return Math.round(statsCombination * actualStaminaModifier + 100);
  };

  const setActualStats = (member, teamAlignment) => {
    var newMember = { ...member, hp: 0, powerstats: [] };
    Object.keys(member.powerstats).forEach(stat => {
      newMember.powerstats[stat] = getActualStat(
        member.powerstats[stat],
        member.actualStamina,
        member.alignment,
        teamAlignment
      );
    });
    newMember.hp = getHeroHP(newMember);
    return newMember;
  };

  const processTeam = (team, teamAlignment) => {
    var newTeam = [];
    team.forEach(member => {
      newTeam.push(setActualStats(member, teamAlignment));
    });
    return newTeam;
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
          heroes.push(processHeroData(data));
        })
      );
      const firstTeam = heroes.slice(0, 5);
      const firstTeamAlignment = getTeamAlignment(firstTeam);
      const processedFirstTeam = processTeam(firstTeam, firstTeamAlignment);

      const secondTeam = heroes.slice(5, 10);
      const secondTeamAlignment = getTeamAlignment(secondTeam);
      const processedSecondTeam = processTeam(secondTeam, secondTeamAlignment);

      setTeams([{ team: processedFirstTeam }, { team: processedSecondTeam }]);
    } catch (e) {
      console.error(e);
    }
  };

  const getTeamAlignment = team => {
    var goodCount = 0;
    var badCount = 0;
    team.forEach(member => {
      if (member.alignment === 'bad') {
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
          <HeroTeam heroes={teams[0].team} top={true} />
          <div className="team-name">Equipo 1</div>
          <div className="divider"></div>
          <div className="team-name">Equipo 2</div>
          <HeroTeam heroes={teams[1].team} top={false} />
        </div>
      )}
    </div>
  );
}

export default App;
