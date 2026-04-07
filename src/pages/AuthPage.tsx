import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { LoginForm } from '../components/auth/LoginForm';
import { Calendar } from 'lucide-react';

export function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">AgendaPro</h1>
          </div>

          <p className="text-gray-600 text-center mb-8">
            Gestión de turnos para tu negocio
          </p>

          <div className="mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg font-medium transition ${
                  !isLogin
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Registrarse
              </button>
            </div>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              {isLogin ? 'Sin cuenta? ' : 'Ya tienes cuenta? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-medium hover:underline"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Prueba gratuita de 14 días</p>
          <p>Sin necesidad de tarjeta de crédito</p>
        </div>
      </div>
    </div>
  );
}
