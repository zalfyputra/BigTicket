const DEFAULT_STATE = {
  id: "",
  role: "",
  fullname: "",
};

export const userReducer = (state = DEFAULT_STATE, action) => {
  if (action.type === "USER_LOGIN") {
    const dupState = { ...state };

    dupState.id = action.payload.id;
    dupState.role = action.payload.role;
    dupState.fullname = action.payload.fullname;

    return dupState;
  } else if (action.type === "USER_LOGOUT") {
    return DEFAULT_STATE;
  }
  return state;
};
