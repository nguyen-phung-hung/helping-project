import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link className="relative w-16 h-16 cursor-pointer " href={"/"}>
      <Image src={"/logo.png"} alt="logo" fill />
    </Link>
  );
};

export default Logo;
