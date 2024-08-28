// reducers/holdingDetailsReducer.ts

const initialState = {
  holdingDetails: null,
  loading: false,
  error: null,
};

export const holdingDetailsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "FETCH_HOLDING_DETAILS_REQUEST":
      return { ...state, loading: true };
    case "FETCH_HOLDING_DETAILS_SUCCESS":
      return { ...state, loading: false, holdingDetails: action.payload };
    case "FETCH_HOLDING_DETAILS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
