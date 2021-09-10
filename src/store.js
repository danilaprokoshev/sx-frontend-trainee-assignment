import { configureStore } from '@reduxjs/toolkit';
import storiesInfoReducer from './slices/storiesInfo/storiesInfoSlice.js';
import commentsInfoReducer from './slices/commentsInfo/commentsInfoSlice.js'

const getStoreInstance = () => configureStore({
  reducer: {
    storiesInfo: storiesInfoReducer,
    commentsInfo: commentsInfoReducer,
  },
});

export default getStoreInstance;
