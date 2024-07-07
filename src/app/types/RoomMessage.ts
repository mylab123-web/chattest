import RoomMember from "./RoomMemberType";
import RoomMessageAction from "./RoomMessageAction";

export default interface RoomMessage {
  sender: RoomMember;
  action: RoomMessageAction;
  destination: string;
}
