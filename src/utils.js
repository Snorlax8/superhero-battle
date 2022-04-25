import axios from 'axios';
import { MAIL_URL, BACKEND_URL } from './constants';

export const getRandomNumber = max => {
  return Math.floor(Math.random() * (max + 1));
};

export const getEmojiString = emojiCode => {
  return String.fromCodePoint(emojiCode);
};

export const getSuperHero = async id => {
  const response = await fetch(BACKEND_URL, {
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    body: JSON.stringify({ id }),
  });
  const data = await response.json();
  return data;
};

export const sendMail = (message, recipient) => {
  axios({
    url: `${MAIL_URL}`,
    method: 'POST',
    auth: {
      username: 'api',
      password: `${process.env.REACT_APP_MAIL_API_KEY}`,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      from: 'Superhero Battle Academy <noreply@battle.com>',
      to: `${recipient}`,
      subject: 'Superhero Battle - Resultados',
      html: `${message}`,
    }),
  });
};
