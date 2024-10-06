import styled from 'styled-components';
import darkIcon from './lib/dark.png';
import lightIcon from './lib/light.png';

export const LightModeIcon = ({toggleLightMode}) => {
  return (
    <IconWrapper onClick={toggleLightMode}>
      <img
        src={lightIcon}
        alt="light mode"
        style={{
          cursor: 'pointer',
          height: 48,
        }}
      />
    </IconWrapper>
  );
};

export const DarkModeIcon = ({toggleDarkMode}) => {
  return (
    <IconWrapper onClick={toggleDarkMode}>
      <img
        src={darkIcon}
        alt="dark mode"
        style={{
          cursor: 'pointer',
          height: 32,
        }}
      />
    </IconWrapper>
  );
};

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px; /* Set the desired width for the wrapper */
  height: 50px; /* Set the desired height for the wrapper */
  cursor: pointer;
`;
