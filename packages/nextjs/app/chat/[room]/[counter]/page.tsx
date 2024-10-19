"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import SellRoomChat from "~~/components/SellRoomChat";
import { db } from "~~/lib/firebase";

interface PageParams {
  params: {
    room: string;
    counter: number; // Include tradeId in the params
  };
}

export default function page({ params }: PageParams) {
  const { room } = params;
  const { data: session, status } = useSession();
  const [email, setEmail] = useState<null | string>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  useEffect(() => {
    console.log(status, session?.user?.email);
    if (status === "authenticated" && session?.user?.email) {
      setEmail(email);
    }
  }, [session, status]);
  const messagesRef = collection(db, "messages");

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const queryMessages = query(messagesRef, where("roomId", "==", room), orderBy("createdAt"));
    const unsuscribe = onSnapshot(queryMessages, snapshot => {
      const messages: any[] = [];
      snapshot.forEach(doc => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages[0], "MEssage 0");
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  async function pushMessage(text: string) {
    console.log(text, email);
    if (text === "") return;
    if (session?.user?.email === null) return;
    await addDoc(messagesRef, {
      text,
      createdAt: serverTimestamp(),
      email: session?.user?.email,
      roomId: room,
    });

    setNewMessage("");
  }

  return (
    <SellRoomChat
      roomId={room}
      setNewMessage={setNewMessage}
      newMessage={newMessage}
      messages={messages}
      pushMessage={pushMessage}
    />
  );
}
