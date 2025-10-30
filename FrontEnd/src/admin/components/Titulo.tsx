import { FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAdminStore } from "../context/AdminContext";

export function Titulo() {
    const { admin } = useAdminStore();

    return (
        <nav className="bg-blue-500 dark:bg-gray-900 shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
                <Link to="/admin" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="./LogoTeste.png" className="h-16 w-auto" alt="Logo KicksCamisetas" />
                    <span className="text-2xl md:text-3xl font-bold text-white">
                        Sistema Administrativo : KicksCamisetas
                    </span>
                </Link>

                <div className="flex items-center space-x-2 text-white font-semibold">
                    <FiUsers className="text-xl" />
                    <span className="text-lg md:text-xl">{admin?.nome || "Administrador"}</span>
                </div>
            </div>
        </nav>
    );
}
