import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface ProductState {
  products: Product[];
  favorites: Product[];
  isOffline: boolean;
}

const initialState: ProductState = {
  products: [],
  favorites: [],
  isOffline: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    
    addToFavorites: (state, action: PayloadAction<Product>) => {
      const exists = state.favorites.find(item => item.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(item => item.id !== action.payload);
    },
    
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const index = state.favorites.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
    
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { 
  setProducts, 
  setOfflineMode, 
  addToFavorites, 
  removeFromFavorites, 
  toggleFavorite,
  clearFavorites 
} = productSlice.actions;

export default productSlice.reducer;