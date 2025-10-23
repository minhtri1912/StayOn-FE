import { createSlice } from '@reduxjs/toolkit';

interface listOrderItemDetailModelsType {
  id: number;
  shoesImage: {
    id: number;
    shoesId: number;
    thumbnail: string;
    isCustomize: boolean;
    isUserCustom: boolean;
  };
  shoesModel: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  size: string;
  unitPrice: number;
}

interface listObjectsType {
  id: number;
  amount: number;
  createdDate: string;
  deliveryDate: string | null;
  orderItemDetailModels: listOrderItemDetailModelsType[];
}

interface CartState {
  cartDetail: {
    paging: object;
    listObjects: listObjectsType[];
  };
  totalItems: number;
}

const initialState: CartState = {
  cartDetail: {
    paging: {},
    listObjects: []
  },
  totalItems: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCart: (state, action) => {
      state.cartDetail = action.payload;
    },
    updateTotalItems: (state, action) => {
      state.totalItems = action.payload;
    }
  }
});

export const { updateCart, updateTotalItems } = cartSlice.actions;
const CartReducer = cartSlice.reducer;
export default CartReducer;
