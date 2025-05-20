"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ChooseRolePage() {
  const router = useRouter();

  const selectRole = (role: "admin" | "employee") => {
    localStorage.setItem("userRole", role);
    if (role === "admin") {
      router.push("/dashboard/monitoreo");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="flex gap-10 justify-center">
          <button
            onClick={() => selectRole("employee")}
            className="flex flex-col items-center cursor-pointer "
          >
            <Image
              src={"/imagen2.png"}
              height={50}
              width={50}
              className="size-32 px-10 py-12 bg-green-100 rounded-2xl shadow-sm  object-contain"
              alt="Imagen Sistema Web"
            />
            <span className="uppercase">Sistema Web</span>
          </button>
          <button
            onClick={() => selectRole("admin")}
            className="flex flex-col items-center cursor-pointer"
          >
            <Image
              src={"/imagen1.png"}
              height={50}
              width={50}
              className="size-32 px-10 py-2 bg-green-100 rounded-2xl shadow-sm  object-contain"
              alt="Imagen Sistema Web"
            />
            <span className="uppercase">Enmienda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
