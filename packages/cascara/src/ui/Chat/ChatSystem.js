import React from 'react';
import pt from 'prop-types';
import { Divider, Ref } from '@fluentui/react-northstar';
import { validateMessageObj } from './utils';

const propTypes = {
  text: pt.oneOfType([pt.string, pt.node, pt.arrayOf(pt.node)]),
};

const ChatSystem = ({ text }) => (
  <Divider color='brand' content={text} important />
);

ChatSystem.displayName = 'Chat.System';
ChatSystem.propTypes = propTypes;

const objPropTypes = {
  message: pt.object.isRequired,
  ref: pt.object.isRequired,
};

// This returns the object that FUI is expecting, along with the component and props
const getChatSystemObj = (obj) => {
  const { message, ref } = obj;

  validateMessageObj(objPropTypes, obj, ChatSystem.displayName);

  return {
    // NOTE: System messages are expected to be returned as children, not as a `message` key
    children: (
      <Ref id={message.id} innerRef={ref}>
        <ChatSystem {...message} />
      </Ref>
    ),
    key: message.id,
  };
};

export { getChatSystemObj };

export default ChatSystem;