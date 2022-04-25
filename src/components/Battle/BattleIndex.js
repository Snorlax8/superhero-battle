import { useEffect } from 'react';
import Proptypes from 'prop-types';
import './Battle.css';
import { getRandomNumber } from '../../utils';
import BattleLayout from './BattleLayout';

function Battle({
  setBattleEnded,
  battleText,
  setBattleText,
  round,
  setRound,
  teams,
  clearingBattle,
  setMailBody,
}) {
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

  return (
    <BattleLayout clearingBattle={clearingBattle} startRound={startRound} />
  );
}

Battle.propTypes = {
  battleEnded: Proptypes.bool,
  setBattleEnded: Proptypes.func,
  battleText: Proptypes.array,
  setBattleText: Proptypes.func,
  round: Proptypes.number,
  setRound: Proptypes.func,
  teams: Proptypes.array,
  setTeams: Proptypes.func,
  clearingBattle: Proptypes.bool,
  setMailBody: Proptypes.func,
};

export default Battle;