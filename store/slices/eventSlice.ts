import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  choosedAnswerData: [],
  isShowRunningEventModal: true,
  eventProfile: null,
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setChoosedAnswer: (state, action) => {
      state.choosedAnswerData = action.payload;
    },
    setIsShowRunningEventModal: (state, action) => {
      state.isShowRunningEventModal = action.payload;
    },
    setEventProfile: (state, action) => {
      state.eventProfile = action.payload;
    },
  },
});

export const { setChoosedAnswer, setIsShowRunningEventModal, setEventProfile } = eventSlice.actions;

export const getChoosedAnswer = (state) => state.event.choosedAnswerData;
export const getIsShowRunningEventModal = (state) => state.event.isShowRunningEventModal;
export const getEventProfile = (state) => state.event.eventProfile;

export default eventSlice.reducer;
