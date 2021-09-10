import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
import routes from '../routes.js';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStoriesById, setCurrentStoryId } from '../slices/storiesInfo/storiesInfoSlice.js';
import { fetchCommentsByIds } from '../slices/commentsInfo/commentsInfoSlice.js';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const STORIES_FROM = 0;
const STORIES_TO = 100;
const DELAY = 60000;

const getNewStoriesIds = (contents, from = STORIES_FROM, to = STORIES_TO) => (JSON.parse(contents)).slice(from, to);

const HomePage = () => {
  const dispatch = useDispatch();
  const storiesAllIds = useSelector((state) => state.storiesInfo.allIds);
  const storiesById = useSelector((state) => state.storiesInfo.byId);
  const loading = useSelector((state) => state.storiesInfo.loading);

  const fetchContent = async () => {
    try {
      const { data: { contents: storiesIds } } = await axios.get(routes.newStoriesPath());
      const newHundredStoriesIds = getNewStoriesIds(storiesIds);
      dispatch(fetchStoriesById(newHundredStoriesIds));
    } catch {
      console.log('Network Error. Try refresh page.'); // TODO: refactor error handling
    }
  };

  const memoizedFetchContent = useCallback(
    fetchContent,
    [dispatch]
  );

  const handleUpdateStories = async () => {
    await fetchContent();
  };

  useEffect(() => {
    memoizedFetchContent();
    const id = setInterval(memoizedFetchContent, DELAY);
    return () => {
      clearInterval(id);
    };
  }, [memoizedFetchContent]);

  useEffect(() => {
    const commentsIds = storiesAllIds
      .filter((id) => storiesById[id].descendants > 0)
      .flatMap((id) => storiesById[id].kids);
    dispatch(fetchCommentsByIds(commentsIds));

    return () => {};
  }, [storiesById]);

  const handleSelectStory = (id) => () => {
    dispatch(setCurrentStoryId(id));
  };

  const renderStoryInfo = (id) => (
    <Link
      key={id}
      to="/story"
      className="list-group-item list-group-item-action"
      aria-current="true"
      onClick={handleSelectStory(id)}
    >
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">{storiesById[id].title}</h5>
        <small>{storiesById[id].time}</small>
      </div>
      <p className="mb-1">Score: {storiesById[id].score}</p>
      <small>Author: {storiesById[id].by}</small>
    </Link>
  );

  return (
    <main className="flex-grow-1">
      <section className="container-fluid container-xxl p-5">
        <div className="row">
          <div className="col-md-10 col-lg-10 order-1 mx-auto posts">
            <div className="card text-white border-0 bg-secondary">
              <div className="card-body">
                <div className="d-flex w-100 justify-content-between">
                  <h2 className="card-title h2 text-white">New 100 Stories</h2>
                  <Button
                    variant="outline-light"
                    onClick={handleUpdateStories}
                    disabled={loading === 'pending'}
                  >Update stories</Button>
                </div>
              </div>
              {
                 _.isEqual(storiesById, {})
                  ? (
                    <div className="list-group-item list-group-item-action">
                      <div className="h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status" />
                      </div>
                    </div>
                  )
                  : (
                    <div className="list-group">
                      {storiesAllIds.length > 0 && storiesAllIds.map((id) => renderStoryInfo(id))}
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
