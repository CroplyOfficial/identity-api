import { Socket } from "socket.io";
import { verifyCredential } from "../identityUtils/vc";

const rootSocket = (io: any) => {
  io.on("connection", (socket: Socket) => {
    const { roomId }: any = socket.handshake.query;
    if (roomId) {
      socket.join(roomId);
    }

    if (roomId) {
      socket.on("shareCred", async (data) => {
        const { vc, hiddenFields } = data;
        const result = await verifyCredential(vc);
        console.log(result);
        const credentialSubjectKeys = Object.keys(vc.credentialSubject).filter(
          (key) => !hiddenFields.includes(key)
        );
        const credentialSubject: Record<string, unknown> = {};
        console.log(credentialSubjectKeys);
        for (const key of credentialSubjectKeys) {
          credentialSubject[key] = vc.credentialSubject[key];
        }
        io.in(roomId).emit("shareCred", {
          vc: { ...vc, credentialSubject },
          result,
        });
      });
      socket.on("enter", () => {
        console.log("entered");
        io.in(roomId).emit("enter", "enter");
      });
    }
  });
};

export default rootSocket;
