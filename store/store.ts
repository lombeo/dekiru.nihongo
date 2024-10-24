import { configureStore } from "@reduxjs/toolkit";
import { applicationSlice } from "@src/store/slices/applicationSlice";
import { authSlice } from "@src/store/slices/authSlice";
import { cartSlice } from "@src/store/slices/cartSlice";
import { chatSlice } from "@src/store/slices/chatSlice";
import { friendSlice } from "@src/store/slices/friendSlice";
import { recruitmentSlice } from "@src/store/slices/recruitmentSlice";
import { scratchSlice } from "@src/store/slices/scratchSlice";
import { createWrapper } from "next-redux-wrapper";
import { eventSlice } from "@src/store/slices/eventSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      [applicationSlice.name]: applicationSlice.reducer,
      [authSlice.name]: authSlice.reducer,
      [chatSlice.name]: chatSlice.reducer,
      [friendSlice.name]: friendSlice.reducer,
      [recruitmentSlice.name]: recruitmentSlice.reducer,
      [cartSlice.name]: cartSlice.reducer,
      [scratchSlice.name]: scratchSlice.reducer,
      [eventSlice.name]: eventSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;

export const wrapper = createWrapper<AppStore>(makeStore);
