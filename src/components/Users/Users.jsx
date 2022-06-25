import React from 'react';
import Loading from '../common/Loading/Loading';
import UserItems from './UserItems/UserItems';
import Paginator from '../common/Paginator/Paginator';

const Users = ({
  totalUsers,
  pageSize,
  changePage,
  page,
  followQueue,
  updateFollowQueue,
  users,
  follow,
  unfollow,
  isLoading,
  portionSize,
}) => {
  if (isLoading) return <Loading />;

  return (
    <div>
      <UserItems
        followQueue={followQueue}
        updateFollowQueue={updateFollowQueue}
        users={users}
        follow={follow}
        unfollow={unfollow}
      />
      <Paginator
        pageSize={pageSize}
        portionSize={portionSize}
        totalElems={totalUsers}
        changePage={changePage}
        page={page}
      />
    </div>
  );
};

export default Users;
