import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  profile: null,
  roles: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setRoles(state, action) {
      state.roles = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setRoles, setProfile } = authSlice.actions;

export const selectProfile = (state: any) => state.auth.profile;
export const selectRoles = (state: any) => state.auth.roles;
export default authSlice.reducer;
