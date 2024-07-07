import MemberType from "./MemberType";

export default interface Room {
  id: string;
  title: string;
  members: MemberType[];
  createdAt: string;
}
