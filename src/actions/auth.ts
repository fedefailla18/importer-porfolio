import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from "./types";

import { register, login, logout } from "../services/auth.service";
import { Dispatch } from "redux";

export type CallableDispatch<Params = any, Output = any> = (
  params?: Params
) => Promise<Output>;

export const Register =
  (username: any, email: any, password: any) =>
  (dispatch: CallableDispatch) => {
    return register(username, email, password).then(
      (response: { data: { message: any } }) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });

        return Promise.resolve();
      },
      (error: {
        response: { data: { message: any } };
        message: any;
        toString: () => any;
      }) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        dispatch({
          type: REGISTER_FAIL,
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

        return Promise.reject();
      }
    );
  };

export type Error = { response: any; message: any };

export const Login =
  (username: string, password: string) => async (dispatch: Dispatch) => {
    try {
      // Call AuthService.login which should return a promise
      const response = await login(username, password);

      // Assuming AuthService.login resolves with user data
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: response.data }, // Adjust this based on your data structure
      });

      return Promise.resolve();
    } catch (error) {
      /*      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();*/

      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: "message",
      });

      return Promise.reject();
    }
  };

export const Logout = () => (dispatch: CallableDispatch) => {
  logout();

  dispatch({
    type: LOGOUT,
  });
};
