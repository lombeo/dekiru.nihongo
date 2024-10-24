import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  openDrawerChat: false,
  listRoomChat: [],
  chatWindows: [],
  fetched: false,
  count: 0,
  hasMoreRoomChat: false,
  siteSocket: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setOpenDrawerChat: (state, action) => {
      state.openDrawerChat = action.payload;
    },
    setListRoomChat: (state, action) => {
      state.listRoomChat = action.payload;
    },
    setChatWindows: (state, action) => {
      state.chatWindows = action.payload;
    },
    setFetched: (state, action) => {
      state.fetched = action.payload;
    },
    setHasMoreRoomChat: (state, action) => {
      state.hasMoreRoomChat = action.payload;
    },
    setSiteSocket: (state, action) => {
      state.siteSocket = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.chat,
      };
    },
  },
});

export const {
  setOpenDrawerChat,
  setCount,
  setListRoomChat,
  setFetched,
  setChatWindows,
  setHasMoreRoomChat,
  setSiteSocket,
} = chatSlice.actions;

export const selectOpenDrawerChat = (state) => state.chat.openDrawerChat;
export const selectCount = (state) => state.chat.count;
export const selectListRoomChat = (state) => state.chat.listRoomChat;
export const selectChatWindows = (state) => state.chat.chatWindows;
export const selectFetched = (state) => state.chat.fetched;
export const selectHasMoreRoomChat = (state) => state.chat.hasMoreRoomChat;
export const selectSiteSocket = (state) => state.chat.siteSocket;

export default chatSlice.reducer;
