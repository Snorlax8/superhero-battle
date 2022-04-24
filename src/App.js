import { useState, useEffect } from 'react';
import './App.css';
import HeroTeam from './components/HeroTeam/HeroTeam';
import { getRandomNumber } from './utils';

function App() {
  const [teams, setTeams] = useState([]);
  const [readyToLoad, setReadyToLoad] = useState(false);
  const [battleText, setBattleText] = useState([]);
  const [round, setRound] = useState(0);

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

  const getMentalAttackDmg = hero => {
    const statsCombination =
      hero.powerstats.intelligence * 0.7 +
      hero.powerstats.speed * 0.2 +
      hero.powerstats.combat * 0.1;
    return Math.floor(statsCombination * hero.fb);
  };

  const getStrongAttackDmg = hero => {
    const statsCombination =
      hero.powerstats.intelligence * 0.7 +
      hero.powerstats.speed * 0.2 +
      hero.powerstats.combat * 0.1;
    return Math.floor(statsCombination * hero.fb);
  };

  const getFastAttackDmg = hero => {
    const statsCombination =
      hero.powerstats.speed * 0.55 +
      hero.powerstats.durability * 0.25 +
      hero.powerstats.strength * 0.2;
    return Math.floor(statsCombination * hero.fb);
  };

  const heroAttack = hero => {
    const type = getRandomNumber(3);
    switch (type) {
      case 1:
        return { type: 'Mental', damage: getMentalAttackDmg(hero) };
      case 2:
        return { type: 'Strong', damage: getStrongAttackDmg(hero) };
      case 3:
        return { type: 'Fast', damage: getFastAttackDmg(hero) };
      default:
        return { type: 'Mental', damage: getStrongAttackDmg(hero) };
    }
  };

  const getRoundBattleText = (attacker, opponent, attack) => {
    return [
      {
        text: `¡${attacker.name} ataca a ${opponent.name}!`,
        class: '',
        emojiCode: '0x1F4A5',
      },
      {
        text: `${attacker.name} realiza un ataque de tipo ${attack.type} que genera ${attack.damage} de daño.`,
        class: '',
        emojiCode:
          attack.type === 'Strong'
            ? '0x1F4AA'
            : attack.type === 'Fast'
            ? '0x23E9'
            : '0x1F9E0',
      },
      {
        text: `${opponent.name} queda con ${opponent.hp} de HP.`,
        class: '',
        emojiCode: opponent.hp > 0 ? '0x1F9B8' : '0x1FAA6',
      },
    ];
  };

  const getRoundWinningTeamText = (winningTeam, losingTeam) => {
    return {
      text: `No quedan integrantes del equipo ${losingTeam}. ¡El equipo ${winningTeam} ha vencido!`,
      class: '',
      emojiCode: '0x1F3C6',
    };
  };

  const displayText = textArray => {
    setBattleText([...battleText, ...textArray]);
  };

  const getEmojiString = emojiCode => {
    return String.fromCodePoint(emojiCode);
  };

  const buttonClicked = () => {
    setRound(round + 1);
  };

  const beginRound = () => {
    var beginText = {
      text: `¡Empieza la ronda ${round}! El equipo 1 comienza con su ataque.`,
      class: '',
      emojiCode: '0x1F4E3',
    };
    var aliveHeroesFirstTeam = teams[0].filter(hero => hero.hp > 0);
    var aliveHeroesSecondTeam = teams[1].filter(hero => hero.hp > 0);
    var roundBattleText = [beginText];
    aliveHeroesFirstTeam.forEach(hero => {
      if (aliveHeroesSecondTeam.length > 0) {
        const randomIndex = getRandomNumber(aliveHeroesSecondTeam.length - 1);
        const opponent = aliveHeroesSecondTeam[randomIndex];
        const attack = heroAttack(hero);
        opponent.hp -= attack.damage;
        roundBattleText = [
          ...roundBattleText,
          ...getRoundBattleText(hero, opponent, attack),
        ];
        if (opponent.hp <= 0) aliveHeroesSecondTeam.splice(randomIndex, 1);
      } else {
        roundBattleText = [
          ...roundBattleText,
          {
            text: `${hero.name} no tiene a quien atacar, así que se toma un descanso.`,
            class: '',
            emojiCode: '0x1f3d6',
          },
        ];
      }
    });
    if (aliveHeroesSecondTeam.length === 0) {
      roundBattleText = [...roundBattleText, getRoundWinningTeamText(1, 2)];
    }
    displayText(roundBattleText);

    // if (aliveHeroesFirstTeam.length > 0) {
    //   setBattleText([...battleText, '¡Turno del equipo 2!']);

    //   aliveHeroesSecondTeam.forEach(hero => {
    //     const randomIndex = getRandomNumber(aliveHeroesFirstTeam.length - 1);
    //     const opponent = aliveHeroesFirstTeam[randomIndex];
    //     const attack = heroAttack(hero);
    //     console.log('random index es', randomIndex);
    //     console.log('opponent es', opponent);
    //     roundBattleText = [
    //       ...roundBattleText,
    //       `¡El héroe ${hero.name} ataca al héroe ${opponent.name}!`,
    //       `${hero.name} realiza un ataque de tipo ${attack.type} que genera ${attack.damage} de daño.`,
    //       `${opponent.name} queda con ${opponent.hp} de HP.`,
    //     ];
    //     console.log('Atacará el héroe', hero.name);
    //     console.log('Fue atacado el héroe', opponent.name);
    //     console.log(
    //       'El héroe atacado comenzó la ronda con esta hp',
    //       opponent.hp
    //     );
    //     opponent.hp -= attack.damage;
    //     console.log('El héroe atacante hizo un ataque de tipo', attack.type);
    //     console.log('El héroe atacante hizo el siguiente daño', attack.damage);
    //     console.log(
    //       'El héroe atacado terminó la ronda con esta hp',
    //       opponent.hp
    //     );
    //   });
    // } else {
    //   roundBattleText = [
    //     ...roundBattleText,
    //     'No quedan integrantes del equipo 1 en pie. ¡El equipo 2 ha vencido!',
    //   ];
    // }
    // setBattleText(roundBattleText);
  };

  useEffect(() => {
    if (round > 0) {
      beginRound();
    }
  }, [round]);

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
          <HeroTeam heroes={teams[0]} top={true} />
          <div className="team-name">Equipo 1</div>
          <div className="begin-battle-container">
            <div className="begin-battle">
              Para comenzar una batalla, haz click en el botón:
              <button onClick={() => buttonClicked()}>Pelear una ronda</button>
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
          <HeroTeam heroes={teams[1]} top={false} />
        </div>
      )}
    </div>
  );
}

export default App;
