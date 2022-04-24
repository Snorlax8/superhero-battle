import { useState, useEffect } from 'react';
import './App.css';
import HeroTeam from './components/HeroTeam/HeroTeam';
import { getRandomNumber, sendMail } from './utils';
import { BACKEND_URL } from './constants';

function App() {
  const [teams, setTeams] = useState([]);
  const [readyToLoad, setReadyToLoad] = useState(false);
  const [battleText, setBattleText] = useState([]);
  const [round, setRound] = useState(0);
  const [battleEnded, setBattleEnded] = useState(false);
  const [clearingBattle, setClearingBattle] = useState(false);
  const [mail, setMail] = useState('');
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
      text: `No quedan integrantes del equipo ${losingTeam}. ¡El equipo ${winningTeam} es el vencedor!`,
      class: '',
      emojiCode: '0x1F3C6',
    };
  };

  const getRoundTieText = () => {
    return {
      text: `¡Es un empate! Ningún equipo ha salido victorioso.`,
      class: '',
      emojiCode: '0x26d4',
    };
  };

  const displayText = textArray => {
    setBattleText([...battleText, ...textArray]);
  };

  const getEmojiString = emojiCode => {
    return String.fromCodePoint(emojiCode);
  };

  const startRound = () => {
    setRound(round + 1);
  };

  const getEmailBody = (winningTeam, losingTeam, tie) => {
    var winningTeamMembers = '';
    winningTeam.members.forEach((member, index) => {
      if (index !== winningTeam.members.length - 1) {
        winningTeamMembers = winningTeamMembers.concat(`${member.name}, `);
      } else
        winningTeamMembers = winningTeamMembers.concat(`y ${member.name}.`);
    });

    var losingTeamMembers = '';
    losingTeam.members.forEach((member, index) => {
      if (index !== losingTeam.members.length - 1) {
        losingTeamMembers = losingTeamMembers.concat(`${member.name}, `);
      } else losingTeamMembers = losingTeamMembers.concat(`y ${member.name}.`);
    });

    var winningText = tie
      ? '¡El resultado fue un empate! No hubo equipo ganador.'
      : `¡El <b>equipo ${winningTeam.name}</b> resultó victorioso!`;
    return `<div><p>El equipo ${winningTeam.name} estuvo compuesto por: ${winningTeamMembers}</p> <p>El equipo ${losingTeam.name} estuvo compuesto por: ${losingTeamMembers}</p> <p>${winningText}</p></div>`;
  };

  const clearBattle = () => {
    setClearingBattle(true);
    setBattleEnded(false);
    getSuperhero();
    setRound(0);
  };

  const heroBattle = (attackingTeam, opposingTeam, beginText = '') => {
    var attackText = [
      {
        text: `Ataca el equipo ${attackingTeam.name}`,
        class: '',
        emojiCode: '0x1F93C',
      },
    ];
    var roundBattleText = [...beginText, ...attackText];
    attackingTeam.members.forEach(hero => {
      if (opposingTeam.members.length > 0) {
        const randomIndex = getRandomNumber(opposingTeam.members.length - 1);
        const opponent = opposingTeam.members[randomIndex];
        const attack = heroAttack(hero);
        opponent.hp -= attack.damage;
        roundBattleText = [
          ...roundBattleText,
          ...getRoundBattleText(hero, opponent, attack),
        ];
        if (opponent.hp <= 0) opposingTeam.members.splice(randomIndex, 1);
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

    if (opposingTeam.members.length === 0) {
      var tie = attackingTeam.members.length === 0;
      var finalText = tie
        ? getRoundTieText()
        : getRoundWinningTeamText(attackingTeam.name, opposingTeam.name);

      roundBattleText = [...roundBattleText, finalText];
      var emailBody = '';
      attackingTeam.name === '1'
        ? (emailBody = getEmailBody(teams[0], teams[1], tie))
        : (emailBody = getEmailBody(teams[1], teams[0], tie));

      setMailBody(emailBody);
      setBattleEnded(true);
    }
    return roundBattleText;
  };

  const getTeamAttackText = (
    attackingTeam,
    opposingTeam,
    roundBattleText,
    beginText = ''
  ) => {
    if (attackingTeam.members.length > 0 && opposingTeam.members.length > 0) {
      roundBattleText = [
        ...roundBattleText,
        ...heroBattle(attackingTeam, opposingTeam, beginText),
      ];
    }
    return roundBattleText;
  };

  const beginRound = () => {
    var roundBattleText = [];
    var aliveHeroesFirstTeam = {
      members: teams[0].members.filter(hero => hero.hp > 0),
      name: teams[0].name,
    };
    var aliveHeroesSecondTeam = {
      members: teams[1].members.filter(hero => hero.hp > 0),
      name: teams[1].name,
    };
    var teamsAlive = [aliveHeroesFirstTeam, aliveHeroesSecondTeam];
    var beginText = [
      {
        text: `¡Empieza la ronda ${round}!`,
        class: '',
        emojiCode: '0x1F4E3',
      },
    ];
    var startingTeam = getRandomNumber(1);

    roundBattleText = getTeamAttackText(
      teamsAlive[startingTeam],
      teamsAlive[1 - startingTeam],
      roundBattleText,
      beginText
    );

    roundBattleText = getTeamAttackText(
      teamsAlive[1 - startingTeam],
      teamsAlive[startingTeam],
      roundBattleText
    );

    if (roundBattleText.length > 0) {
      displayText(roundBattleText);
    }
  };

  useEffect(() => {
    if (round > 0) beginRound();
    else setBattleText([]);
  }, [round]);

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
                <div className="begin-battle">
                  Para comenzar una ronda, haz click en el botón:
                  <button
                    disabled={clearingBattle}
                    onClick={() => startRound()}
                  >
                    Pelear una ronda
                  </button>
                </div>
              )}
              <div className="begin-battle"></div>
              <div>
                {battleEnded && (
                  <div>
                    La batalla terminó. Puedes ingresar tu mail para recibir un
                    resumen o comenzar otra batalla.
                    <div>
                      <input
                        placeholder="Ingresar mail"
                        value={mail}
                        onChange={e => setMail(e.target.value)}
                      ></input>
                      <button onClick={() => sendMail(mailBody, mail)}>
                        Enviar mail
                      </button>
                    </div>
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
