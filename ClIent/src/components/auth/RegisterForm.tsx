import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { isValidEmail } from '@/utils/helpers';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email invalide';
    }

    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.acceptTerms) {
      errors.acceptTerms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      // Navigate only after successful registration
      setTimeout(() => navigate('/dashboard'), 100);
    } catch {
      // L'erreur est gérée par le contexte
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Créer un compte
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Rejoignez-nous et commencez à gérer vos propriétés
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jean"
                value={formData.firstName}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {validationErrors.firstName && (
              <p className="text-sm text-red-600">{validationErrors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            {validationErrors.lastName && (
              <p className="text-sm text-red-600">{validationErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          {validationErrors.email && (
            <p className="text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10 pr-10"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-sm text-red-600">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
              }
            />
            <Label htmlFor="acceptTerms" className="text-sm font-normal cursor-pointer">
              J'accepte les{' '}
              <Link to="/terms" className="text-rose-600 hover:text-rose-700">
                conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link to="/privacy" className="text-rose-600 hover:text-rose-700">
                politique de confidentialité
              </Link>
            </Label>
          </div>
          {validationErrors.acceptTerms && (
            <p className="text-sm text-red-600">{validationErrors.acceptTerms}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-rose-600 hover:bg-rose-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            'Créer un compte'
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-rose-600 hover:text-rose-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};
