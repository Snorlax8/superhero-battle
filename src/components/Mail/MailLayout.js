import PropTypes from 'prop-types';

function MailLayout({
  mail, setMail, sendMail, mailBody,
}) {
  return (
    <div>
      <input
        placeholder="Ingresar mail"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <button type="button" onClick={() => sendMail(mailBody, mail)}>Enviar mail</button>
    </div>
  );
}

MailLayout.propTypes = {
  mail: PropTypes.string.isRequired,
  setMail: PropTypes.func.isRequired,
  sendMail: PropTypes.func.isRequired,
  mailBody: PropTypes.string.isRequired,
};

export default MailLayout;
