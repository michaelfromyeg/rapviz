const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <div className="footer">
      <p className="footer-text">Deployed on Railway. 🚂</p>
      <p className="footer-text">&copy; {year} RapViz</p>
    </div>
  );
};

export default Footer;
