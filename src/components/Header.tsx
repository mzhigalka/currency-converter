import React from "react";

interface HeaderProps {
  usdRate: number;
  eurRate: number;
}

const Header: React.FC<HeaderProps> = ({ usdRate, eurRate }) => {
  return (
    <header className="header">
      <div>
        <span>USD/UAH: {usdRate ? usdRate : "00.000"}</span>
      </div>
      <div>
        <span>EUR/UAH: {eurRate ? eurRate : "00.000"}</span>
      </div>
    </header>
  );
};

export default Header;
