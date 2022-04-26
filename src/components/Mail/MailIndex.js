import { useState } from 'react';
import PropTypes from 'prop-types';
import { sendMail } from '../../utils';

import MailLayout from './MailLayout';

function Mail({ mailBody }) {
  const [mail, setMail] = useState('');

  return (
    <MailLayout
      mail={mail}
      setMail={setMail}
      sendMail={sendMail}
      mailBody={mailBody}
    />
  );
}

Mail.propTypes = {
  mailBody: PropTypes.string.isRequired,
};

export default Mail;
