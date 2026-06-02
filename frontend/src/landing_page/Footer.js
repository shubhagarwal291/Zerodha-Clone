import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-main mt-5">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col">
            <img src="media/images/logo.svg" style={{ width: "140px" }} alt="Zerodha logo" />
            <p className="mt-3 mb-0">
              &copy; 2010 - 2024, Not Zerodha Broking Ltd. All rights reserved.
            </p>
          </div>
          <div className="col">
            <p className="footer-heading">Company</p>
            <Link to="/about" className="footer-link">About</Link>
            <br />
            <Link to="/product" className="footer-link">Products</Link>
            <br />
            <Link to="/pricing" className="footer-link">Pricing</Link>
            <br />
            <Link to="/" className="footer-link">Referral programme</Link>
            <br />
            <Link to="/" className="footer-link">Careers</Link>
            <br />
            <Link to="/" className="footer-link">Zerodha.tech</Link>
            <br />
            <Link to="/" className="footer-link">Press & media</Link>
            <br />
            <Link to="/" className="footer-link">Zerodha cares (CSR)</Link>
          </div>
          <div className="col">
            <p className="footer-heading">Support</p>
            <Link to="/support" className="footer-link">Contact</Link>
            <br />
            <Link to="/" className="footer-link">Support portal</Link>
            <br />
            <Link to="/" className="footer-link">Z-Connect blog</Link>
            <br />
            <Link to="/" className="footer-link">List of charges</Link>
            <br />
            <Link to="/" className="footer-link">Downloads & resources</Link>
          </div>
          <div className="col">
            <p className="footer-heading">Account</p>
            <Link to="/signup" className="footer-link">Open an account</Link>
            <br />
            <Link to="/" className="footer-link">Fund transfer</Link>
            <br />
            <Link to="/" className="footer-link">60 day challenge</Link>
          </div>
        </div>
        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p>
            Zerodha Broking Ltd.: Member of NSE​ &​ BSE – SEBI Registration no.:
            INZ000031633 CDSL: Depository services through Zerodha Securities
            Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015 Commodity Trading
            through Zerodha Commodities Pvt. Ltd. MCX: 46025 – SEBI Registration
            no.: INZ000038238 Registered Address: Zerodha Broking Ltd.,
            #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School,
            J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India. For any
            complaints pertaining to securities broking please write to
            complaints@zerodha.com, for DP related to dp@zerodha.com. Please
            ensure you carefully read the Risk Disclosure Document as prescribed
            by SEBI | ICF
          </p>

          <p>
            Procedure to file a complaint on SEBI SCORES: Register on SCORES
            portal. Mandatory details for filing complaints on SCORES: Name,
            PAN, Address, Mobile Number, E-mail ID. Benefits: Effective
            Communication, Speedy redressal of the grievances
          </p>

          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>

          <p>
            "Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers. Receive
            information of your transactions directly from Exchange on your
            mobile/email at the end of the day. Issued in the interest of
            investors. KYC is one time exercise while dealing in securities
            markets - once KYC is done through a SEBI registered intermediary
            (broker, DP, Mutual Fund etc.), you need not undergo the same
            process again when you approach another intermediary." Dear
            Investor, if you are subscribing to an IPO, there is no need to
            issue a cheque. Please write the Bank account number and sign the
            IPO application form to authorize your bank to make payment in case
            of allotment. In case of non allotment the funds will remain in your
            bank account. As a business we don't give stock tips, and have not
            authorized anyone to trade on behalf of others. If you find anyone
            claiming to be part of Zerodha and offering such services, please
            create a ticket here.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
