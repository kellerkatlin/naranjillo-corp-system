"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";

type FormInputs = {
  id: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    if (data.id === "admin" && data.password === "admin123") {
      const token = Array(64)
        .fill(null)
        .map(() => Math.random().toString(36).charAt(2))
        .join("");
      document.cookie = `token=${token}; path=/; max-age=3600`;
      window.location.href = "/choose-role";
    } else {
      setError("id", {
        type: "manual",
        message: "ID o contraseña incorrectos",
      });
      setError("password", {
        type: "manual",
        message: "ID o contraseña incorrectos",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[url(/banner.jpg)] bg-cover bg-center">
      <div className="flex flex-col items-center w-[900px] gap-4">
        <Image
          src="/logo1.png"
          alt="Naranjilo Corp"
          height={100}
          width={100}
          className="w-40"
        />

        <div className="w-[90%] md:w-1/2   p-10 backdrop-blur-md bg-white/10 border-2 rounded-lg border-solid border-primary/30">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input
              type="text"
              placeholder="Ingrese ID"
              {...register("id", { required: true })}
              className="w-full border border-orange-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.id && (
              <p className="text-red-500 text-sm">
                {errors.id.message ?? "ID es obligatorio"}
              </p>
            )}

            <input
              type="password"
              placeholder="Ingrese contraseña"
              {...register("password", { required: true })}
              className="w-full border border-orange-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message || "Contraseña es obligatoria"}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-orange-400 text-white py-2 rounded-md font-semibold"
            >
              INICIAR SESIÓN
            </button>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                {...register("remember")}
                className="accent-orange-400"
              />
              Mantener la sesión iniciada
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
