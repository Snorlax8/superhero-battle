import { useState } from 'react';
import PropTypes from 'prop-types';
import { sendMail } from '../../utils';

import MailLayout from './MailLayout';

const Mail = ({ mailBody }) => {
  const [mail, setMail] = useState('');

  return (
    <MailLayout
      mail={mail}
      setMail={setMail}
      sendMail={sendMail}
      mailBody={mailBody}
    />
  );
};

Mail.propTypes = {
  mail: PropTypes.string,
  setMail: PropTypes.func,
  sendMail: PropTypes.func,
  mailBody: PropTypes.string,
};

export default Mail;
