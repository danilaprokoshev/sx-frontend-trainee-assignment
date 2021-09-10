import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes.js';
import normalizeData from '../../utils/normalizer.js';

export const fetchCommentsByIds = createAsyncThunk(
  'comments/fetchByIds',
  async (commentsIds,thunkAPI) => {
    const getCommentsByIds = (ids) => ids.map(async (id) => {
        const { data: {contents: commentInfo } } = await axios.get(routes.itemPath(id));
        const parsedCommentInfo = JSON.parse(commentInfo);
        if (!parsedCommentInfo.hasOwnProperty('kids')) {
          return parsedCommentInfo;
        }
        return Promise.all([parsedCommentInfo, ...getCommentsByIds(parsedCommentInfo.kids)]);
      });

    const commentsByIds = getCommentsByIds(commentsIds);
    const promise = Promise.all(commentsByIds);

    return promise
      .then((comments) => comments.flat(Infinity))
      .then((comments) => normalizeData(comments));
  }
)

export const commentsInfoSlice = createSlice({
  name: 'commentsInfo',
  initialState: {
    loading: 'idle',
    byId: {},
    allIds: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCommentsByIds.pending, (state, action) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchCommentsByIds.fulfilled, (state, { payload }) => {
      state.byId = payload.byId;
      state.allIds = payload.allIds;
      state.loading = 'idle';
    });
  },
});

export default commentsInfoSlice.reducer;
