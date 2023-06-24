import { authEndpoint, clientId, redirectUri, scopes } from "../config";

const Welcome = ({ onPoetry }) => {
  return (
    <div className="welcome">
      <h3>Select your source...</h3>
      <a
        className="btn btn--loginApp-link"
        href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=token&show_dialog=true`}
      >
        SPOTIFY
      </a>
      <button className="btn btn--loginApp-link" onClick={onPoetry}>
        FREESTYLE
      </button>
    </div>
  );
};

export default Welcome;
