import { createSlice } from "@reduxjs/toolkit";
import { CommentContextType } from "@src/services/CommentService/types";
import { HYDRATE } from "next-redux-wrapper";

export interface CartItem {
  id?: number;
  isVoucher?: boolean;
  contextType: CommentContextType;
  contextId: any;
  title: string;
  link: string;
  count: number;
  price: number;
  discount?: number;
  thumbnail?: string;
  data?: any;
}

const initialState = {
  items: [],
  count: 0,
  isFetched: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setIsFetched: (state, action) => {
      state.isFetched = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.cart,
      };
    },
  },
});

export const { setItems, setCount, setIsFetched } = cartSlice.actions;

export const selectItems = (state: any): CartItem[] => state.cart.items;
export const selectCount = (state: any): number => state.cart.count;
export const selectIsFetched = (state: any): boolean => state.cart.isFetched;
export default cartSlice.reducer;
