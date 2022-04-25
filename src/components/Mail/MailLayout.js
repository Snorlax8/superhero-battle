import PropTypes from 'prop-types';

const MailLayout = ({ mail, setMail, sendMail, mailBody }) => {
  return (
    <div>
      <input
        placeholder="Ingresar mail"
        value={mail}
        onChange={e => setMail(e.target.value)}
      ></input>
      <button onClick={() => sendMail(mailBody, mail)}>Enviar mail</button>
    </div>
  );
};

MailLayout.propTypes = {
  mail: PropTypes.string,
  setMail: PropTypes.func,
  sendMail: PropTypes.func,
  mailBody: PropTypes.string,
};

export default MailLayout;
