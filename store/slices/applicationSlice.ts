import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState: {
  showHeader: boolean;
  openModalChangeUsername: boolean;
  openModalLogin: boolean | "login" | "register";
  countries: any;
  loadedEventListenerMessage: boolean;
} = {
  showHeader: true,
  openModalLogin: false,
  countries: null,
  openModalChangeUsername: false,
  loadedEventListenerMessage: false,
};

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setShowHeader: (state, action) => {
      state.showHeader = action.payload;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    setOpenModalLogin: (state, action) => {
      state.openModalLogin = action.payload;
    },
    setOpenModalChangeUsername: (state, action) => {
      state.openModalChangeUsername = action.payload;
    },
    setLoadedEventListenerMessage: (state, action) => {
      state.loadedEventListenerMessage = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.application,
      };
    },
  },
});

export const {
  setCountries,
  setShowHeader,
  setOpenModalLogin,
  setOpenModalChangeUsername,
  setLoadedEventListenerMessage,
} = applicationSlice.actions;

export const selectShowHeader = (state) => state.application.showHeader;

export const selectCountries = (state) => state.application.countries;

export const selectOpenModalLogin = (state) => state.application.openModalLogin;

export const selectOpenModalChangeUsername = (state) => state.application.openModalChangeUsername;

export const selectLoadedEventListenerMessage = (state) => state.application.loadedEventListenerMessage;

export default applicationSlice.reducer;
