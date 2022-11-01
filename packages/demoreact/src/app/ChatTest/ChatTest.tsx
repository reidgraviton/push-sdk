import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  Section,
} from '../components/StyledComponents';
import Loader from '../components/Loader';
import { Web3Context, EnvContext } from '../context';


const ChatTest = () => {
  const { library, account, chainId } = useContext<any>(Web3Context);
  const { env, isCAIP } = useContext<any>(EnvContext);
  const [isLoading, setLoading] = useState(false);

  const NavMenu = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;

    @media only screen and (max-width: 900px) {
      flex-direction: column;
    }
  `;

  return (
    <div>
      <h2>Chat Test page</h2>

      <Loader show={isLoading} />

      <Section>
        <NavMenu>
          <Link to="/get" className="nav-button">
            CHAT.GET
          </Link>
          <Link to="/create" className="nav-button">
            CHAT.CREATE
          </Link>
          <Link to="/decrypt" className="nav-button">
            CHAT.DECRYPT
          </Link>
          <Link to="/send" className="nav-button">
            CHAT.SEND
          </Link>
          <Link to="/approve" className="nav-button">
            CHAT.APPROVE
          </Link>
          <Link to="/chats" className="nav-button">
            CHAT.CHATS
          </Link>
          <Link to="/requests" className="nav-button">
            CHAT.REQUESTS
          </Link>
          <Link to="/hash" className="nav-button">
            CHAT.CONVERSATIONHASH
          </Link>
          <Link to="/latest" className="nav-button">
            CHAT.LATEST
          </Link>
          <Link to="/history" className="nav-button">
            CHAT.HISTORY
          </Link>
        </NavMenu>
      </Section>
    </div>
  );
};

export default ChatTest;