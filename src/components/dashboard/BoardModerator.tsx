import React, { useState, useEffect } from "react";

import { getUserBoard } from "../../services/user.service";

const BoardModerator = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    getUserBoard().then(
      (response: { data: React.SetStateAction<string> }) => {
        setContent(response.data);
      },
      (error: {
        response: { data: { message: any } };
        message: any;
        toString: () => any;
      }) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default BoardModerator;
