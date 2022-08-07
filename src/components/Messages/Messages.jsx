import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserMessage from './UserMessage/UserMessage';
import Users from './Users/Users';
import SendText from './SendText/SendText';
import placeholder from '../../assets/pfps/placeholder.jpg';
import { Navigate } from 'react-router';
import { getDialogsPage, getStoredText } from '../../redux/dialogs-selector';
import { useDispatch, useSelector } from 'react-redux';
import { getUID } from '../../redux/auth-selector';
import { getMyData } from '../../redux/profile-selector';
import { getProfile } from '../../redux/profile-reducer';
import LoadingPage from '../common/Loading/LoadingPage';
import { compose } from 'redux';
import withAuthRedirect from '../../HOC/withAuthRedirect';

const Messages = () => {
  const memoryText = useSelector(getStoredText);
  const { userMessages, users } = useSelector(getDialogsPage);
  const myData = useSelector(getMyData);
  const uid = useSelector(getUID);

  const dispatch = useDispatch();

  const [shouldShowDialog, setShouldShowDialog] = useState(false);

  useEffect(() => {
    dispatch(getProfile(uid));
  }, [dispatch, uid]);

  if (!myData) return <LoadingPage />;

  const userDialogElements = [];
  for (let i = 0; i < userMessages.length; i++) {
    userDialogElements[i] = userMessages[i].map((e) => {
      return (
        <div key={e.id}>
          <UserMessage
            message={e}
            pfp={
              e.from === 'me'
                ? myData.photos.small || placeholder
                : require(`../../assets/pfps/u${users[i].id}.jpg`)
            }
          />
        </div>
      );
    });
  }

  const routes = userDialogElements.map((e, i) => {
    return (
      <Route
        path={'/' + (i + 1)}
        key={i}
        element={
          <div className="flex flex-col w-full relative">
            <div className="lg:mx-16 mb-32 overflow-scroll h-full">{userDialogElements[i]}</div>
            <div
              className="absolute bottom-0 lg:w-3/5 sm:w-full self-center
              pb-4 rounded-t px-2 py-2 bg-gray-300"
            >
              <SendText memoryText={memoryText} id={i} />
            </div>
          </div>
        }
      />
    );
  });

  return (
    <div
      className="flex
         bg-gray-100 lg:rounded-lg lg:p-8
         text-gray-700 font-semibold
         h-screen w-full"
    >
      {window.innerWidth > 720 && <Users users={users} />}

      <Routes className="w-full">
        {window.innerWidth <= 720 && <Route path="/all" element={<Users users={users} />} />}
        <Route path="/" element={<Navigate to={'1'} />} />
        {routes}
      </Routes>
    </div>
  );
};

export default compose(withAuthRedirect)(Messages);
