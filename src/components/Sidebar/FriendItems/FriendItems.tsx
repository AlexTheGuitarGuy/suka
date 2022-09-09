import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDialogUsers } from '../../../redux/dialogs-selector';
import { DialogsUser } from '../../../types/types';

const FriendItems = () => {
  const friends = useSelector(getDialogUsers);

  let friendList = friends.map(({ name, avatar }: DialogsUser, index: number) => {
    if (index < 5) {
      return (
        <NavLink to={`/messages/${index}`} key={name}>
          <div
            className="p-2 flex items-center mt-4
                        transition-colors
                        border-b-2 border-transparent
                        hover:bg-gray-200 active:bg-gray-300
                        hover:text-gray-600 active:text-gray-700
                        hover:border-gray-400 active:border-gray-500
          "
          >
            <img
              src={avatar}
              alt={name}
              className="h-12 w-12
              xl:h-16 xl:w-16
              rounded-full"
            />
            <div className="ml-2 text-sm font-normal xl:ml-4">{name}</div>
          </div>
        </NavLink>
      );
    }
    return null;
  });

  return (
    <div className="text-gray-500 bg-gray-100 p-2 -mr-4 rounded-lg font-semibold">
      <div className="text-lg ml-2 xl:text-xl">Contacts:</div>
      <div>
        {friendList}
        {friendList.length > 5 && <span className="font-normal ml-4 text-sm">and more...</span>}
      </div>
    </div>
  );
};

export default FriendItems;
