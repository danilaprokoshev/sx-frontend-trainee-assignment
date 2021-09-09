import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../../routes.js';

const normalizeData = (data) => data
  .reduce((acc, item) => {
    acc.byId[item.id] = item;
    const date = new Date(item.time * 1000);
    acc.byId[item.id].time = date.toLocaleDateString("en-UK");
    acc.allIds.push(item.id);
    return acc;
  }, { byId: {}, allIds:[] });

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
    byId: {},
    allIds: [],
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCommentsByIds.fulfilled, (state, { payload }) => {
      state.byId = payload.byId;
      state.allIds = payload.allIds;
    });
  },
});

// export const {
// } = commentsInfoSlice.actions;

export default commentsInfoSlice.reducer;
