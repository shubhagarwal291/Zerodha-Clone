import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://investsphere-stock-trading-platform.onrender.com";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [balance, setBalance] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.name || user.email || "User";
  const token = localStorage.getItem("token");

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`${API_URL}/trade/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data.balance);
      } catch (err) {
        console.error("Balance fetch error:", err);
      }
    };
    fetchBalance();

    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleMenuClick = (index) => setSelectedMenu(index);
  const handleProfileClick = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "http://localhost:3000/signup";
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    lineHeight: "1.1",
    marginRight: "20px",
  }}
>
  <span
    style={{
      color: "#2563eb",
      fontSize: "21px",
      fontWeight: "800",
    }}
  >
    InvestSphere
  </span>

  <span
    style={{
      color: "#94a3b8",
      fontSize: "10px",
      letterSpacing: "1px",
    }}
  >
    Track. Analyze. Invest.
  </span>
</div>

      {/* Balance Display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          backgroundColor: "#f0faf0",
          borderRadius: "6px",
          border: "1px solid #c8e6c9",
          marginRight: "8px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#666" }}>Balance</span>
        <span
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: balance !== null && balance <= 0 ? "#e53935" : "#2e7d32",
          }}
        >
          ₹
          {balance !== null
            ? balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })
            : "..."}
        </span>
      </div>

      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Trade History
              </p>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/alerts"
              onClick={() => handleMenuClick(7)}
            >
              <p className={selectedMenu === 7 ? activeMenuClass : menuClass}>
                Alerts
              </p>
            </Link>
          </li>

          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
            
        </ul>
        <hr style={{ marginLeft: "16px" }}/>

        {/* Profile Section */}
        <div style={{ position: "relative" }}>
          <div
            className="profile"
            onClick={handleProfileClick}
            style={{ cursor: "pointer" }}
          >
            <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          </div>

          {/* Dropdown */}
          {isProfileDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                minWidth: "180px",
                zIndex: 1000,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "2px",
                  }}
                >
                  Logged in as
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {username}
                </p>
              </div>

              <div
                onClick={handleLogout}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#e53935",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span style={{ fontSize: "16px" }}>⏻</span>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
