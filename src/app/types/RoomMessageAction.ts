import RoomMember from "./RoomMemberType";

export default interface RoomMessageAction {
  type: "JOIN" | "LEAVE" | "STANDARD";
  subject: RoomMember | string | null;
}
