import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState: {
  showHeader: boolean;
  openModalChangeUsername: boolean;
  openModalLogin: boolean | "login" | "register";
  countries: any;
  openModalSignUp: boolean;
  openModalSignUpEn: boolean;
} = {
  showHeader: true,
  openModalLogin: false,
  countries: null,
  openModalChangeUsername: false,
  openModalSignUp: false,
  openModalSignUpEn: false,
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
    setOpenModalSignUp: (state, action) => {
      state.openModalSignUp = action.payload;
    },
    setOpenModalSignUpEn: (state, action) => {
      state.openModalSignUpEn = action.payload;
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
  setOpenModalSignUp,
  setOpenModalSignUpEn,
} = applicationSlice.actions;

export const selectShowHeader = (state) => state.application.showHeader;

export const selectCountries = (state) => state.application.countries;

export const selectOpenModalLogin = (state) => state.application.openModalLogin;

export const selectOpenModalChangeUsername = (state) => state.application.openModalChangeUsername;

export const selectOpenModalSignUp = (state) => state.application.openModalSignUp;

export const selectOpenModalSignUpEn = (state) => state.application.openModalSignUpEn;

export default applicationSlice.reducer;
