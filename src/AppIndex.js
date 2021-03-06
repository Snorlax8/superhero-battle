import { useState, useEffect } from 'react';
import './App.css';
import { getRandomNumber, getSuperHero } from './utils';
import { maxHeroId, teamsSize } from './constants';
import App from './AppLayout';

function AppIndex() {
  const [teams, setTeams] = useState([]);
  const [readyToLoad, setReadyToLoad] = useState(false);
  const [battleText, setBattleText] = useState([]);
  const [round, setRound] = useState(0);
  const [battleEnded, setBattleEnded] = useState(false);
  const [clearingBattle, setClearingBattle] = useState(false);
  const [mailBody, setMailBody] = useState('');

  const getHeroIds = () => {
    const heroIds = new Set();
    while (heroIds.size !== teamsSize) {
      heroIds.add(getRandomNumber(maxHeroId));
    }

    return heroIds;
  };

  const processHeroStat = (stat) => {
    if (stat && stat !== 'null') {
      return parseInt(stat, 10);
    }
    return getRandomNumber(100);
  };

  const getActualStamina = () => getRandomNumber(10);

  const getFiliationCoefficient = (heroAlignment, teamAlignment) => {
    const modifier = 1 + getRandomNumber(9);
    return heroAlignment === teamAlignment
      ? modifier
      : Math.ceil(modifier ** -1);
  };

  const getActualStat = (
    baseStat,
    heroActualStamina,
    heroFiliationCoefficient,
  ) => {
    const modifiedBaseStat = 2 * baseStat + heroActualStamina;
    return Math.floor((heroFiliationCoefficient * modifiedBaseStat) / 1.1);
  };

  const processHeroData = (data) => {
    const heroStats = {
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

  const getHeroHP = (hero) => {
    const actualStaminaModifier = 1 + hero.actualStamina / 10;
    const statsCombination = (hero.powerstats.strength * 0.8
        + hero.powerstats.durability * 0.7
        + hero.powerstats.power)
      / 2;
    return Math.round(statsCombination * actualStaminaModifier + 100);
  };

  const setActualStats = (member, teamAlignment) => {
    const newMember = {
      ...member,
      hp: 0,
      fb: 0,
      powerstats: [],
    };
    const filliationCoefficient = getFiliationCoefficient(
      newMember.alignment,
      teamAlignment,
    );
    Object.keys(member.powerstats).forEach((stat) => {
      newMember.powerstats[stat] = getActualStat(
        member.powerstats[stat],
        member.actualStamina,
        filliationCoefficient,
      );
    });
    newMember.hp = getHeroHP(newMember);
    newMember.originalHp = newMember.hp;
    newMember.fb = filliationCoefficient;

    return newMember;
  };
  const getTeamAlignment = (team) => {
    let goodCount = 0;
    let badCount = 0;
    team.forEach((member) => {
      if (member.alignment === 'bad') {
        badCount += 1;
      } else {
        goodCount += 1;
      }
    });
    return goodCount >= badCount ? 'good' : 'bad';
  };
  const processTeam = (team, name) => {
    const teamAlignment = getTeamAlignment(team);
    const newMembers = [];
    team.forEach((member) => {
      newMembers.push(setActualStats(member, teamAlignment));
    });
    return { members: newMembers, name };
  };

  const formTeams = async () => {
    try {
      const heroIds = [...getHeroIds()];
      const heroes = [];
      await Promise.all(
        heroIds.map(async (id) => {
          const data = await getSuperHero(id);
          heroes.push(processHeroData(data));
        }),
      );
      const firstTeam = heroes.slice(0, teamsSize / 2);
      const processedFirstTeam = processTeam(firstTeam, '1');

      const secondTeam = heroes.slice(teamsSize / 2, teamsSize);
      const processedSecondTeam = processTeam(secondTeam, '2');

      setTeams([processedFirstTeam, processedSecondTeam]);
    } catch (e) {
      setBattleText(e);
    }
  };

  const healHeroes = (heroes) => {
    const healedHeroes = [];
    heroes.forEach((hero) => {
      healedHeroes.push({ ...hero, hp: hero.originalHp });
    });
    return healedHeroes;
  };

  const healTeams = () => {
    const healedTeams = [];
    teams.forEach((team) => {
      healedTeams.push({ ...team, members: healHeroes(team.members) });
    });
    setTeams(healedTeams);
  };

  const clearBattle = (newTeams) => {
    setBattleEnded(false);
    if (newTeams) {
      setClearingBattle(true);
      formTeams();
    } else {
      healTeams();
    }
    setRound(0);
  };

  useEffect(() => {
    if (teams.length > 0) {
      setReadyToLoad(true);
      setClearingBattle(false);
    }
  }, [teams]);

  useEffect(() => {
    formTeams();
  }, []);

  return (
    <div>
      {readyToLoad && (
        <App
          teams={teams}
          setTeams={setTeams}
          battleEnded={battleEnded}
          setBattleEnded={setBattleEnded}
          battleText={battleText}
          setBattleText={setBattleText}
          round={round}
          setRound={setRound}
          clearingBattle={clearingBattle}
          setMailBody={setMailBody}
          mailBody={mailBody}
          clearBattle={clearBattle}
        />
      )}
    </div>
  );
}

export default AppIndex;
