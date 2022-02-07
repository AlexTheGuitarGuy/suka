import React from 'react';
import { Route, Routes } from 'react-router-dom';
import s from './Messages.module.css';
import UserMessage from './UserMessage/UserMessage';
import Users from './Users/Users';
import SendText from './SendText/SendText';

const Messages = (props) => {
    let userDialogElements = [];
    for (let i = 0; i < props.state.userMessages.length; i++) {
        userDialogElements[i] = props.state.userMessages[i].map(e => {
            return (
                <div key={e.id}>
                    <UserMessage message={e} theirPfp={props.state.users[i].pfp} myPfp={props.profileData.pfp} />
                </div>
            );
        });
    }

    return (
        <div className={s.repartition}>
            <div className={s.dialogs}>
                <Users state={props.state.users} />
            </div>
            <div className={s.messages}>
                <Routes>
                    <Route exact strict path='/' element={userDialogElements[0]} />
                    <Route exact strict path='/1' element={userDialogElements[0]} />
                    <Route exact strict path='/2' element={userDialogElements[1]} />
                    <Route exact strict path='/3' element={userDialogElements[2]} />
                    <Route exact strict path='/4' element={userDialogElements[3]} />
                </Routes>
                <SendText memoryText={props.memoryText}
                    storeText={props.storeText}
                    send={props.send} />
            </div>

        </div >
    );
}

export default Messages;