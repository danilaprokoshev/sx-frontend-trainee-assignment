import React, {useCallback, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Accordion, Button, Spinner } from 'react-bootstrap';
import {Link, Redirect} from 'react-router-dom';
import _ from 'lodash';
import { fetchCommentsByIds } from "../slices/commentsInfo/commentsInfoSlice";

const DELAY = 60000;

const StoryPage = () => {
  const dispatch = useDispatch();
  const currentStoryId = useSelector((state) => state.storiesInfo.currentStoryId);
  const storiesAllIds = useSelector((state) => state.storiesInfo.allIds);
  const storiesById = useSelector((state) => state.storiesInfo.byId);
  const commentsById = useSelector((state) => state.commentsInfo.byId);
  const loading = useSelector((state) => state.commentsInfo.loading);

  const fetchComments = () => {
    const commentsIds = storiesAllIds
      .filter((id) => storiesById[id].descendants > 0)
      .flatMap((id) => storiesById[id].kids);
    dispatch(fetchCommentsByIds(commentsIds));
  };

  const memoizedFetchComments = useCallback(
    fetchComments,
    [storiesById, dispatch, storiesAllIds]
  );

  useEffect(() => {
    const id = setInterval(memoizedFetchComments, DELAY);

    return () => {
      clearInterval(id);
    };
  }, [memoizedFetchComments]);

  const getCommentsCount = (byId, id) => byId[id].descendants;

  const renderSubComments = (id) => {
    if (!commentsById[id].hasOwnProperty('kids')) {
      return (
        <li
          className="list-group-item"
          dangerouslySetInnerHTML={{__html: commentsById[id].text}}
        />
      );
    }

    return (
      <>
        <li
          className="list-group-item"
          dangerouslySetInnerHTML={{__html: commentsById[id].text}}>
        </li>
        <ul>
          {commentsById[id].kids.map(renderSubComments)}
        </ul>
      </>
    );
  }

  const renderComments = (id) => (
    <Accordion.Item eventKey={id} key={id}>
      <Accordion.Header>
        <div
          className="d-flex flex-wrap"
          dangerouslySetInnerHTML={{ __html: commentsById[id].text}}
        />
      </Accordion.Header>
      <Accordion.Body>
        <ul>
          {commentsById[id].hasOwnProperty('kids') && commentsById[id].kids.map(renderSubComments)}
        </ul>
      </Accordion.Body>
    </Accordion.Item>
  );

  if (!currentStoryId) {
    return <Redirect to="/"/>;
  }

  return (
    <main className="flex-grow-1">
      <section className="container-fluid container-xxl p-5">
        <div className="row">
          <div className="col-md-10 col-lg-10 order-1 mx-auto">
            <div className="card text-white bg-secondary mb-3">
              <div className="card-header">
                <div className="d-flex w-100 justify-content-between">
                  <Button as={Link} to="/"
                    variant="outline-light"
                  >Back to Home</Button>
                  <small>{storiesById[currentStoryId].time}</small>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{storiesById[currentStoryId].title}</h5>
                <small>by {storiesById[currentStoryId].by}</small>
                <p> </p>
                <p className="card-text">Comments: <span className="badge text-dark bg-light rounded-pill">{getCommentsCount(storiesById, currentStoryId)}</span></p>
                <p> </p>
                <div className="d-flex w-100 justify-content-between">
                  <a href={storiesById[currentStoryId].url} className="btn btn-light">Go to source</a>
                  <Button
                    variant="outline-light"
                    onClick={fetchComments}
                    disabled={loading === 'pending'}
                  >Update comments</Button>
                </div>
              </div>
            </div>
            <Accordion>
              <>
                {
                  _.isEqual(commentsById, {})
                    ? (
                      <div className="h-100 d-flex justify-content-center align-items-center">
                        <Spinner animation="border" role="status"/>
                      </div>
                    )
                    :
                    (
                      getCommentsCount(storiesById, currentStoryId) > 0
                        ? storiesById[currentStoryId].kids.map((id) => renderComments(id))
                        : (
                          <Accordion.Item eventKey="0" key="0">
                            <Accordion.Header>No comments yet.</Accordion.Header>
                          </Accordion.Item>
                        )
                    )
                }
              </>
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StoryPage;
