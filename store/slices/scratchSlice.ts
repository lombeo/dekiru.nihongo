import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  status: null,
};

export const scratchSlice = createSlice({
  name: "scratch",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.scratch,
      };
    },
  },
});

export const { setStatus } = scratchSlice.actions;

export const selectStatus = (state) => state.scratch.status;

export default scratchSlice.reducer;
