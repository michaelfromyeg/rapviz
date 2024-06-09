import { ReactElement } from "react";
import { authEndpoint, clientId, redirectUri, scopes } from "../config";

interface WelcomeProps {
  onPoetry: () => void;
  onUpload: () => void;
}

const Welcome = ({ onPoetry, onUpload }: WelcomeProps): ReactElement => {
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
      <button className="btn btn--loginApp-link" onClick={onUpload}>
        UPLOAD
      </button>
    </div>
  );
};

export default Welcome;
