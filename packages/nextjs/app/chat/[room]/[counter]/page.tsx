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

  const session: any = useSession();
  const [newMessage, setNewMessage] = useState<string>("");

  const messagesRef = collection(db, "messages");

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const queryMessages = query(messagesRef, where("roomId", "==", room), orderBy("createdAt"));
    const unsuscribe = onSnapshot(queryMessages, snapshot => {
      const messages: any[] = [];
      snapshot.forEach(doc => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  async function pushMessage(text: string) {
    if (text === "") return;
    let email = "";
    while (session?.data?.user?.email === undefined) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    email = session?.data?.user?.email;
    await addDoc(messagesRef, {
      text,
      createdAt: serverTimestamp(),
      email,
      roomId: room,
    });

    setNewMessage("");
  }

  return (
    <SellRoomChat setNewMessage={setNewMessage} newMessage={newMessage} messages={messages} pushMessage={pushMessage} />
  );
}
