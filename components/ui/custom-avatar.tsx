import { Avatar, AvatarFallback } from "./avatar";
import Image from "next/image";

type CustomAvatarProps =
  | {
      hasAvatar: false;
      userName: string;
      children?: React.ReactNode;
    }
  | {
      hasAvatar: true;
      userName: string;
      image: string;
      children?: React.ReactNode;
    };

export default function CustomAvatar(props: CustomAvatarProps) {
  return (
    <div>
      <Avatar>
        {props.hasAvatar ? (
          <Image src={props.image} alt={props.userName || "user avatar"} fill />
        ) : (
          <AvatarFallback>
            <p className="font-bold text-primary dark:text-primary">
              {props.userName.charAt(0).toUpperCase()}
            </p>
          </AvatarFallback>
        )}
      </Avatar>
      {props.children}
    </div>
  );
}
