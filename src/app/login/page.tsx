"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UserService from "@/services/UserService";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [modalError, setModalError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    try {
      const user = await UserService.login(username);
      localStorage.setItem("username", user.username);
      router.push("/");
    } catch {
      setError("Usuario no encontrado");
    }
  };

  const handleCreateUser = async () => {
    if (!newUsername.trim()) {
      setModalError("El nombre de usuario es obligatorio");
      return;
    }
    try {
      const user = await UserService.createUser(newUsername);
      localStorage.setItem("username", user.username);
      setModalOpen(false);
      router.push("/");
    } catch {
      setModalError("Error al crear usuario");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Iniciar sesión
        </h1>

        {/* Input usuario */}
        <label htmlFor="username" className="block text-gray-700 mb-2 font-medium">
          Nombre de usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ej: juanperez"
        />

        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}

        {/* Botón Login */}
        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
        >
          Ingresar
        </button>

        {/* Botón Abrir Modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="mt-3 w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all"
        >
          Crear usuario
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Solo ingresá tu nombre de usuario para comenzar.
        </p>
      </div>

      {/* Modal Crear Usuario */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Crear nuevo usuario
            </h2>

            <input
              type="text"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                setModalError("");
              }}
              placeholder="Nombre de usuario"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            {modalError && (
              <p className="text-red-600 mt-2 text-sm">{modalError}</p>
            )}

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
