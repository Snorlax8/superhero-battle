import { useState, useEffect } from 'react';
import './App.css';
import Battle from './components/Battle/BattleIndex';
import HeroTeam from './components/HeroTeam/HeroTeam';
import { getRandomNumber } from './utils';
import { BACKEND_URL } from './constants';
import Mail from './components/Mail/MailIndex';

function App() {
  const [teams, setTeams] = useState([]);
  const [readyToLoad, setReadyToLoad] = useState(false);
  const [battleText, setBattleText] = useState([]);
  const [round, setRound] = useState(0);
  const [battleEnded, setBattleEnded] = useState(false);
  const [clearingBattle, setClearingBattle] = useState(false);
  const [mailBody, setMailBody] = useState('');
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
    return heroAlignment === teamAlignment
      ? modifier
      : Math.ceil(modifier ** -1);
  };

  const getActualStat = (
    baseStat,
    heroActualStamina,
    heroFiliationCoefficient
  ) => {
    const modifiedBaseStat = 2 * baseStat + heroActualStamina;
    return Math.floor((heroFiliationCoefficient * modifiedBaseStat) / 1.1);
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
    var newMember = { ...member, hp: 0, fb: 0, powerstats: [] };
    const filliationCoefficient = getFiliationCoefficient(
      newMember.alignment,
      teamAlignment
    );
    Object.keys(member.powerstats).forEach(stat => {
      newMember.powerstats[stat] = getActualStat(
        member.powerstats[stat],
        member.actualStamina,
        filliationCoefficient
      );
    });
    newMember.hp = getHeroHP(newMember);
    newMember.fb = filliationCoefficient;

    return newMember;
  };

  const processTeam = (team, teamAlignment, name) => {
    var newMembers = [];
    team.forEach(member => {
      newMembers.push(setActualStats(member, teamAlignment));
    });
    return { members: newMembers, name };
  };

  const getSuperhero = async () => {
    try {
      const heroIds = [...getHeroIds()];
      const heroes = [];
      await Promise.all(
        heroIds.map(async id => {
          const response = await fetch(BACKEND_URL, {
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
      const processedFirstTeam = processTeam(
        firstTeam,
        firstTeamAlignment,
        '1'
      );

      const secondTeam = heroes.slice(5, 10);
      const secondTeamAlignment = getTeamAlignment(secondTeam);
      const processedSecondTeam = processTeam(
        secondTeam,
        secondTeamAlignment,
        '2'
      );

      setTeams([processedFirstTeam, processedSecondTeam]);
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

  const getEmojiString = emojiCode => {
    return String.fromCodePoint(emojiCode);
  };

  const clearBattle = () => {
    setClearingBattle(true);
    setBattleEnded(false);
    getSuperhero();
    setRound(0);
  };

  useEffect(() => {
    if (teams.length > 0) {
      setReadyToLoad(true);
      setClearingBattle(false);
    }
  }, [teams]);

  useEffect(() => {
    getSuperhero();
  }, []);

  return (
    <div>
      {readyToLoad && (
        <div className="App">
          <HeroTeam heroes={teams[0].members} top={true} />
          <div className="team-name">Equipo 1</div>
          <div className="begin-battle-container">
            <div>
              {!battleEnded && (
                <Battle
                  setBattleEnded={setBattleEnded}
                  battleText={battleText}
                  setBattleText={setBattleText}
                  round={round}
                  setRound={setRound}
                  teams={teams}
                  setTeams={setTeams}
                  clearingBattle={clearingBattle}
                  setMailBody={setMailBody}
                />
              )}
              <div className="begin-battle"></div>
              <div>
                {battleEnded && (
                  <div>
                    La batalla terminó. Puedes ingresar tu mail para recibir un
                    resumen o comenzar otra batalla.
                    <Mail mailBody={mailBody} />
                    <button onClick={() => clearBattle()}>
                      Comenzar otra batalla
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="divider">
            {battleText.map((textObject, index) => (
              <div key={index}>
                <span>{getEmojiString(textObject.emojiCode)} </span>
                {textObject.text}
              </div>
            ))}
          </div>
          <div className="team-name">Equipo 2</div>
          <HeroTeam heroes={teams[1].members} top={false} />
        </div>
      )}
    </div>
  );
}

export default App;
