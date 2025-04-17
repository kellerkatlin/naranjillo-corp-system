"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface ProfileFormData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const [photo, setPhoto] = useState<string | null>(null);

  const onSubmit = (data: ProfileFormData) => {
    console.log("Datos del perfil actualizados:", data);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-10 bg-white px-4 md:px-0">
      <Card className="w-full max-w-3xl shadow-lg border border-orange-100">
        <CardHeader>
          <CardTitle className="text-2xl text-orange-600">Mi perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div className="flex items-center gap-4">
              <div className="md:size-20 size-10 rounded-full overflow-hidden bg-gray-200 border border-orange-300">
                {photo ? (
                  <img
                    src={photo}
                    alt="Foto de perfil"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    Sin foto
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm text-gray-600">Cambiar foto</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <div>
              <Label className="mb-1">Nombre</Label>
              <Input
                {...register("name", { required: true })}
                placeholder="Tu nombre"
              />
              {errors.name && (
                <p className="text-sm text-red-500">El nombre es obligatorio</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label className="mb-1">Correo electrónico</Label>
              <Input
                type="email"
                {...register("email", { required: true })}
                placeholder="correo@ejemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">El correo es obligatorio</p>
              )}
            </div>

            <hr className="my-6 border-t border-gray-200" />

            {/* Cambiar contraseña */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Contraseña actual</Label>
                <Input
                  type="password"
                  {...register("currentPassword")}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <Label className="mb-1">Nueva contraseña</Label>
                <Input
                  type="password"
                  {...register("newPassword")}
                  placeholder="••••••••"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="mb-1">Confirmar nueva contraseña</Label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Botón guardar */}
            <div className="pt-4">
              <Button
                type="submit"
                className="bg-primary w-full hover:bg-orange-400"
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
