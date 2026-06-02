import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3002";

const DailyReward = () => {
  const [cooldown, setCooldown] = useState(null);

  useEffect(() => {
    const nextClaim = localStorage.getItem("nextClaim");

    if (nextClaim) {
      setCooldown(Number(nextClaim));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (cooldown && Date.now() >= cooldown) {
        localStorage.removeItem("nextClaim");
        setCooldown(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const claimReward = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/trade/claim-reward`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem(
        "nextClaim",
        res.data.nextClaim
      );

      setCooldown(res.data.nextClaim);

      alert("🎉 ₹10,000 Reward Claimed!");

      window.location.reload();
    } catch (err) {
      const nextClaim =
        err.response?.data?.nextClaim;

      if (nextClaim) {
        localStorage.setItem(
          "nextClaim",
          nextClaim
        );

        setCooldown(nextClaim);
      }

      alert(
        err.response?.data?.message ||
          "Failed to claim reward"
      );
    }
  };

  const formatTime = () => {
    if (!cooldown) return null;

    const diff = cooldown - Date.now();

    if (diff <= 0) return null;

    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor(
      (diff % (1000 * 60 * 60)) /
        (1000 * 60)
    );
    const secs = Math.floor(
      (diff % (1000 * 60)) / 1000
    );

    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div
      style={{
        marginTop: "25px",
        padding: "20px",
        borderRadius: "16px",
        background: "#111827",
        border: "1px solid #1f2937",
      }}
    >
      <h3
        style={{
          color: "#fff",
          marginBottom: "10px",
        }}
      >
        🎁 Daily Reward
      </h3>

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "15px",
        }}
      >
        Claim ₹10,000 every 24 hours
      </p>

      {!cooldown ? (
        <button
          onClick={claimReward}
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Claim ₹10,000
        </button>
      ) : (
        <div
          style={{
            color: "#fbbf24",
            fontWeight: "bold",
          }}
        >
          ⏳ Next reward in: {formatTime()}
        </div>
      )}
    </div>
  );
};

export default DailyReward;