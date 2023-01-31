import { IconArrowBackUp } from "@tabler/icons";
import Link from "next/link";

export default function Page() {
  return (
    <div className="h-screen flex flex-col text-center items-center justify-center">
      <div className="flex h-16 text-2xl items-center">
        <div className=" border-r-2 border-r-stone-600 pr-4">404</div>
        <div className="pl-4">Désolé, cette page n&apos;existe pas</div>
      </div>
      <Link
        className="flex text-xl text-inherit border-b-2 border-b-stone-600 hover:border-b-stone-400 "
        href="/"
      >
        Retour au site <IconArrowBackUp size={28} />
      </Link>
    </div>
  );
}
