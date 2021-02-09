import * as React from "react";
import { addMessage, getMessages, onMessageAdded } from "./graphql/queries";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function Chat({ user }) {
  const [messages, setMessages] = React.useState([]);
  const subscriptionRef = React.useRef(null);

  React.useEffect(() => {
    async function fetchMessages() {
      const messages = await getMessages();
      setMessages(messages);
    }
    fetchMessages();
    return () => {
      console.log("Unsubscribing chat events...");
      subscriptionRef.current.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    subscriptionRef.current = onMessageAdded((message) =>
      setMessages([...messages, message])
    );
  }, [messages]);

  const handleSend = async (text) => {
    await addMessage(text);
  };

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
