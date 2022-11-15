// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const MessageStatus = {
  "SENT": "SENT",
  "DELIVERED": "DELIVERED",
  "READ": "READ"
};

const { ChatRoom, Message, User, ChatRoomUser } = initSchema(schema);

export {
  ChatRoom,
  Message,
  User,
  ChatRoomUser,
  MessageStatus
};