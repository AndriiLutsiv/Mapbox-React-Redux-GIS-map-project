
import styles from './CreateUser.module.scss';
import { useEffect, useState } from 'react';
import { userAPI } from '../../services/UserService';
import { useAuth } from 'hooks/useAuth';
import { UserRow } from './UserRow';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ROUTES } from 'constants/routes';
import { Spinner } from 'components/Spinner';

const CreateUser: React.FC = () => {
  const { data: users, error: getUsersError, isLoading: getUsersIsLoading } = userAPI.useGetUsersQuery();
  const { data: signupToken, error: getSignupTokenError, isLoading: getSignupTokenIsLoading, } = userAPI.useGetSignupTokenQuery();

  const [createRow, setCreateRow] = useState(false);
  const [tokenLink, setTokenLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showCopiedText, setShowCopiedText] = useState(false);

  const generateToken = () => signupToken && setTokenLink(`${process.env.REACT_APP_URL}${ROUTES.SIGN_UP}/${signupToken.token}`);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (copied) {
      setShowCopiedText(true);
      timeoutId = setTimeout(() => {
        setShowCopiedText(false);
        setCopied(false);
      }, 1500);
    }

    return () => clearTimeout(timeoutId);
  }, [copied]);

  if (getUsersIsLoading) {
    return <Spinner className={styles.customSpinner} />
  }
  return <div data-testid="CreateUser" className={styles.createUser}>
    <div className={styles.labels}>
      <div className={styles.label}>User name*</div>
      <div className={styles.label}>User email*</div>
      <div className={styles.label}>User password</div>
    </div>
    {users?.map((user, i: number) => <UserRow key={user.uuid} user={user} />)}
    {
      createRow && <UserRow createRow={true} setCreateRow={setCreateRow} />
    }
    <div className={styles.buttons}>
      <button disabled={createRow} className={styles.button} onClick={() => setCreateRow(true)}>Add user</button>
      <div className={styles.clipBoardContainer}>
        {
          tokenLink ? <CopyToClipboard text={tokenLink} onCopy={() => setCopied(true)}>
            <div className={styles.clipBoard}>Copy link</div>
          </CopyToClipboard>
            : <button className={styles.button} onClick={generateToken}>Generate invite token</button>
        }
        {showCopiedText && <div className={styles.clipBoardText}>Copied</div>}
      </div>
    </div>
  </div>
}

export default CreateUser;