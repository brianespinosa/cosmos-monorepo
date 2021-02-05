import React from 'react';
import pt from 'prop-types';
import {
  Animation,
  Chat as FUIChat,
  Provider,
} from '@fluentui/react-northstar';
import { MoreIcon } from '@fluentui/react-icons-northstar';

import { getSharedMessageKeys, validateMessageObj } from './utils';
import { wiggle } from '../../animations';

const propTypes = {
  isSessionUser: pt.bool,
};

const ChatTyping = ({ isSessionUser = false }) => {
  return (
    <FUIChat.Message
      content={
        <Provider
          theme={{
            animations: {
              wiggle,
            },
          }}
        >
          <Animation name='wiggle'>
            <MoreIcon
              size='larger'
              styles={({ theme: { siteVariables } }) => ({
                color: siteVariables.colorScheme.brand.foreground,
              })}
            />
          </Animation>
        </Provider>
      }
      mine={isSessionUser}
      style={{ minWidth: 'auto' }}
    />
  );
};

ChatTyping.displayName = 'Chat.Typing';
ChatTyping.propTypes = propTypes;

const objPropTypes = {
  isSessionUser: pt.bool,
  message: pt.object.isRequired,
  messageAuthor: pt.object.isRequired,
  ref: pt.object.isRequired,
};

// This returns the object that FUI is expecting, along with the component and props
const getChatTypingObj = (obj) => {
  const { isSessionUser, message, messageAuthor, ref } = obj;

  validateMessageObj(objPropTypes, obj, ChatTyping.displayName);

  return {
    ...getSharedMessageKeys(obj),
    message: (
      <span id={message.id} ref={ref}>
        <ChatTyping
          {...message}
          authorName={messageAuthor.fullName}
          isSessionUser={isSessionUser}
        />
      </span>
    ),
  };
};

getChatTypingObj.propTypes = {
  testShit: pt.bool.isRequired,
};

export { getChatTypingObj };

export default ChatTyping;