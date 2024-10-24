import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  masterData: null,
  isManager: false,
};

export const recruitmentSlice = createSlice({
  name: "recruitment",
  initialState,
  reducers: {
    setMasterData: (state, action) => {
      state.masterData = action.payload;
    },
    setIsManager: (state, action) => {
      state.isManager = action.payload;
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

export const { setMasterData, setIsManager } = recruitmentSlice.actions;

export const selectMasterData = (state) => state.recruitment.masterData;
export const selectIsManager = (state) => state.recruitment.isManager;

export default recruitmentSlice.reducer;
