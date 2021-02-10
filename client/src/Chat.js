import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import * as React from "react";
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from "./graphql/queries";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function Chat({ user }) {
  const { data, loading, error } = useQuery(messagesQuery);
  const [addMessage] = useMutation(addMessageMutation);

  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({
      client,
      subscriptionData: {
        data: { messageAdded: message },
      },
    }) => {
      client.writeData({
        data: {
          messages: [...messages, message],
        },
      });
    },
  });

  const handleSend = async (text) => {
    await addMessage({ variables: { input: { text } } });
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div style={{ color: "#ff0000" }}>Failed to load messages</div>;
  }

  const messages = data ? data.messages : [];

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}
