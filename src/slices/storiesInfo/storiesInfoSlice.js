import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes';
import normalizeData from '../../utils/normalizer.js';

export const fetchStoriesById = createAsyncThunk(
  'stories/fetchByIds',
  async (storiesIds, thunkAPI) => {
    const promises = storiesIds.map((id) => axios.get(routes.itemPath(id))
      .then(({ data: { contents: storyInfo } }) => JSON.parse(storyInfo))
      .then((story) => ({ result: 'success', value: story }))
      .catch((error) => ({ result: 'error', value: error })));
    const promise = Promise.all(promises);

    return promise
      .then((stories) => stories
        .filter((story) => story.result === 'success' && story.value !== null)
        .map((story) => story.value))
      .then((stories) => normalizeData(stories));
  }
);

export const storiesInfoSlice = createSlice({
  name: 'storiesInfo',
  initialState: {
    loading: 'idle',
    byId: {},
    allIds: [],
    currentStoryId: null,
  },
  reducers: {
    setCurrentStoryId: (state, { payload }) => {
      state.currentStoryId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStoriesById.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchStoriesById.fulfilled, (state, { payload }) => {
      state.byId = payload.byId;
      state.allIds = payload.allIds;
      state.loading = 'idle';
    });
  },
});

export const {
  setCurrentStoryId,
} = storiesInfoSlice.actions;

export default storiesInfoSlice.reducer;
