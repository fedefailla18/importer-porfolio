import axios from "axios";

const apiMiddleware = (store) => (next) => (action) => {
  next(action);

  if (action.type.startsWith("ENTITIES_READ_")) {
    const { entityName } = action.urlParameters;
    axios
      .get(`/${entityName}`)
      .then((payload) => payload.json())
      .then((payload) => {
        store.dispatch({
          ...action,
          type: action.type.replace("REQUEST", "SUCCESS"),
          payload,
        });
      });
  }
};
