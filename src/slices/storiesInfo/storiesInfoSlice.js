import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from "../../routes";

// TODO: abstract func and in separate module (lib/utils)

const normalizeData = (data) => data
  .reduce((acc, item) => {
    acc.byId[item.id] = item;
    const date = new Date(item.time * 1000);
    acc.byId[item.id].time = date.toLocaleDateString("en-UK");
    acc.allIds.push(item.id);
    return acc;
  }, { byId: {}, allIds:[] });

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
    byId: {},
    allIds: [],
    currentStoryId: null,
  },
  reducers: {
    // addStoriesIds: (state, { payload }) => {
    //   state.allIds.splice(0, 100, ...payload);
    // },
    setCurrentStoryId: (state, { payload }) => {
      state.currentStoryId = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStoriesById.fulfilled, (state, { payload }) => {
      state.byId = payload.byId;
      state.allIds = payload.allIds;
    });
  },
});

export const {
  setCurrentStoryId,
} = storiesInfoSlice.actions;

export default storiesInfoSlice.reducer;
