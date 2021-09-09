import { configureStore } from '@reduxjs/toolkit';
import storiesInfoReducer from './slices/storiesInfo/storiesInfoSlice.js';
import commentsInfoReducer from './slices/commentsInfo/commentsInfoSlice.js'

export default () => configureStore({
  reducer: {
    storiesInfo: storiesInfoReducer,
    commentsInfo: commentsInfoReducer,
  },
});
