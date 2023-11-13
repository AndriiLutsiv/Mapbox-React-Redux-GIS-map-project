import React from 'react';
import styled from 'styled-components';

function MainPage() {
  return (
    <StyledMain data-testid='MainPage'>
      <div className="container-fluid">
        <p className="fibre_logo">Fibre Planner</p>
      </div>
    </StyledMain>
  );
}

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  font-size: 70px;
  background: url(/img_fibre.png);
  background-position: center;
  background-size: cover;
  color: white;
  font-family: 'Poppins';
  background-color: rgba(9, 9, 9, 1);
  .fibre_logo {
    width: 162px;
    height: 24px;

    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
    /* identical to box height, or 100% */

    color: rgba(255, 255, 255, 1);
  }
`;

export default MainPage;
