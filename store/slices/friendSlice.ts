import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  friends: null,
  received: null,
  invites: null,
  setting: null,
  loadingFriends: true,
};

export const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setReceived: (state, action) => {
      state.received = action.payload;
    },
    setInvites: (state, action) => {
      state.invites = action.payload;
    },
    setSetting: (state, action) => {
      state.setting = action.payload;
    },
    setLoadingFriends: (state, action) => {
      state.loadingFriends = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.friend,
      };
    },
  },
});

export const { setFriends, setReceived, setInvites, setSetting, setLoadingFriends } = friendSlice.actions;

export const selectFriends = (state) => state.friend.friends;
export const selectLoadingFriends = (state) => state.friend.loadingFriends;
export const selectReceived = (state) => state.friend.received;
export const selectInvites = (state) => state.friend.invites;
export const selectSetting = (state) => state.friend.setting;

export default friendSlice.reducer;
