import { NextRequest } from "next/server";
import prismadb from "~~/lib/db";

export async function POST(req: NextRequest) {
  const { text, roomId, email } = await req.json();
  const user = await prismadb.user.findUnique({
    where: {
      email: email,
    },
    select: {
      isSeller: true,
    },
  });

  const sellerOrBuyer = user?.isSeller;

  const message = await prismadb.sell.create({
    //@ts-ignore
    data: {
      text: text,
      gameRoomId: roomId,
      email: email,
    },
  });
  // Prepare the message payload including sellerOrBuyer
  const messageData = {
    id: message.id,
    text: message.text,
    sellerOrBuyer, // Append the sellerOrBuyer flag here
    createdAt: message.createdAt,
  };

  // return new Response(JSON.stringify(message));
  return new Response(JSON.stringify(messageData));
}
