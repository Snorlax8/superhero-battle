import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Battle.css';
import { getRandomNumber } from '../../utils';
import BattleLayout from './BattleLayout';
import { emojiCodes, AttackTypes } from './BattleConstants';

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
  const getMentalAttackDmg = (hero) => {
    const statsCombination = hero.powerstats.intelligence * 0.7
      + hero.powerstats.speed * 0.2
      + hero.powerstats.combat * 0.1;
    return Math.floor(statsCombination * hero.fb);
  };

  const getStrongAttackDmg = (hero) => {
    const statsCombination = hero.powerstats.intelligence * 0.7
      + hero.powerstats.speed * 0.2
      + hero.powerstats.combat * 0.1;
    return Math.floor(statsCombination * hero.fb);
  };

  const getFastAttackDmg = (hero) => {
    const statsCombination = hero.powerstats.speed * 0.55
      + hero.powerstats.durability * 0.25
      + hero.powerstats.strength * 0.2;
    return Math.floor(statsCombination * hero.fb);
  };

  const heroAttack = (hero) => {
    const type = getRandomNumber(3);
    switch (type) {
      case 1:
        return {
          type: AttackTypes.Mental,
          damage: getMentalAttackDmg(hero),
          emojiCode: emojiCodes.brain,
        };
      case 2:
        return {
          type: AttackTypes.Strong,
          damage: getStrongAttackDmg(hero),
          emojiCode: emojiCodes.bicep,
        };
      case 3:
        return {
          type: AttackTypes.Fast,
          damage: getFastAttackDmg(hero),
          emojiCode: emojiCodes.fastForward,
        };
      default:
        return {
          type: AttackTypes.Mental,
          damage: getStrongAttackDmg(hero),
          emojiCode: emojiCodes.brain,
        };
    }
  };

  const BattleText = (text, cssClass, emojiCode) => ({ text, class: `text battle-text ${cssClass}`, emojiCode });

  const attackTextToDisplay = (attacker, opponent, attack) => [
    BattleText(
      `¡${attacker.name} ataca a ${opponent.name}!`,
      '',
      emojiCodes.collision,
    ),
    BattleText(
      `${attacker.name} realiza un ataque de tipo ${attack.type} que genera ${attack.damage} de daño.`,
      '',
      attack.emojiCode,
    ),
    BattleText(
      `${opponent.name} queda con ${opponent.hp} de HP.`,
      '',
      opponent.hp > 0 ? emojiCodes.hero : emojiCodes.tombStone,
    ),
  ];

  const getRoundWinningTeamText = (winningTeam, losingTeam) => BattleText(
    `No quedan integrantes del equipo ${losingTeam}. ¡El equipo ${winningTeam} es el vencedor!`,
    'bold',
    emojiCodes.trophy,
  );

  const getRoundTieText = () => ({
    text: '¡Es un empate! Ningún equipo ha salido victorioso.',
    class: '',
    emojiCode: emojiCodes.noEntry,
  });

  const displayText = (textArray) => {
    setBattleText([...battleText, ...textArray]);
  };

  const startRound = () => {
    setRound(round + 1);
  };

  const getTeamMembersString = (team) => {
    let teamMembers = '';
    team.members.forEach((member, index) => {
      if (index !== team.members.length - 1) {
        teamMembers = teamMembers.concat(`${member.name}, `);
      } else teamMembers = teamMembers.concat(`y ${member.name}.`);
    });
    return teamMembers;
  };

  const getEmailBody = (winningTeam, losingTeam, tie) => {
    const winningTeamMembers = getTeamMembersString(winningTeam);
    const losingTeamMembers = getTeamMembersString(losingTeam);

    const winningText = tie
      ? '¡El resultado fue un empate! No hubo equipo ganador.'
      : `¡El <b>equipo ${winningTeam.name}</b> resultó victorioso!`;
    return `<div><p>El equipo ${winningTeam.name} estuvo compuesto por: ${winningTeamMembers}</p> <p>El equipo ${losingTeam.name} estuvo compuesto por: ${losingTeamMembers}</p> <p>${winningText}</p></div>`;
  };

  const attackOpponent = (attacker, opposingTeam) => {
    const randomIndex = getRandomNumber(opposingTeam.members.length - 1);
    const opponent = opposingTeam.members[randomIndex];
    const attack = heroAttack(attacker);
    opponent.hp -= attack.damage;
    if (opponent.hp <= 0) opposingTeam.members.splice(randomIndex, 1);

    return attackTextToDisplay(attacker, opponent, attack);
  };

  const createMailBody = (attackingTeam, tie) => {
    let emailBody = '';
    if (attackingTeam.name === '1') emailBody = getEmailBody(teams[0], teams[1], tie);
    else emailBody = getEmailBody(teams[1], teams[0], tie);
    setMailBody(emailBody);
  };

  const getHeroRestText = (hero) => BattleText(
    `${hero.name} no tiene a quien atacar, así que se toma un descanso.`,
    '',
    emojiCodes.beach,
  );

  const getHeroAttackText = (hero, opposingTeam) => {
    const heroAttackText = [];
    if (opposingTeam.members.length > 0) {
      heroAttackText.push(...attackOpponent(hero, opposingTeam));
    } else {
      heroAttackText.push(getHeroRestText(hero));
    }
    return heroAttackText;
  };

  const handleBattleEnd = (attackingTeam, opposingTeam, textToDisplay) => {
    const tie = attackingTeam.members.length === 0;
    const finalText = tie
      ? getRoundTieText()
      : getRoundWinningTeamText(attackingTeam.name, opposingTeam.name);
    textToDisplay.push(finalText);

    createMailBody(attackingTeam, tie);

    setBattleEnded(true);
  };

  const getTeamAttackText = (attackingTeam, opposingTeam, beginText = '') => {
    const attackText = [
      BattleText(
        `Ataca el equipo ${attackingTeam.name}`,
        '',
        emojiCodes.wrestling,
      ),
    ];
    const teamAttackText = [...beginText, ...attackText];
    const roundAttackText = [];
    let textToDisplay = [];
    attackingTeam.members.forEach((hero) => {
      roundAttackText.push(...getHeroAttackText(hero, opposingTeam));
    });

    textToDisplay = [...teamAttackText, ...roundAttackText];
    if (opposingTeam.members.length === 0) {
      handleBattleEnd(attackingTeam, opposingTeam, textToDisplay);
    }

    return textToDisplay;
  };

  const getTeamRoundText = (attackingTeam, opposingTeam, beginText = '') => {
    let roundAttackText = [];
    if (attackingTeam.members.length > 0 && opposingTeam.members.length > 0) {
      roundAttackText = [
        ...getTeamAttackText(attackingTeam, opposingTeam, beginText),
      ];
    }
    return roundAttackText;
  };

  const beginRound = () => {
    const aliveHeroesFirstTeam = {
      members: teams[0].members.filter((hero) => hero.hp > 0),
      name: teams[0].name,
    };
    const aliveHeroesSecondTeam = {
      members: teams[1].members.filter((hero) => hero.hp > 0),
      name: teams[1].name,
    };
    const teamsAlive = [aliveHeroesFirstTeam, aliveHeroesSecondTeam];
    const beginText = [
      BattleText(`¡Empieza la ronda ${round}!`, 'bold', emojiCodes.megaphone),
    ];
    const startingTeam = getRandomNumber(1);

    const firstTeamBattleText = getTeamRoundText(
      teamsAlive[startingTeam],
      teamsAlive[1 - startingTeam],
      beginText,
    );

    const secondTeamBattleText = getTeamRoundText(
      teamsAlive[1 - startingTeam],
      teamsAlive[startingTeam],
    );

    const roundAttackText = [...firstTeamBattleText, ...secondTeamBattleText];

    if (roundAttackText.length > 0) {
      displayText(roundAttackText);
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
  setBattleEnded: PropTypes.func.isRequired,
  battleText: PropTypes.instanceOf(Array).isRequired,
  setBattleText: PropTypes.func.isRequired,
  round: PropTypes.number.isRequired,
  setRound: PropTypes.func.isRequired,
  teams: PropTypes.instanceOf(Array).isRequired,
  clearingBattle: PropTypes.bool.isRequired,
  setMailBody: PropTypes.func.isRequired,
};

export default Battle;
