import { useAuth } from '../lib/firebase/useAuth';

interface SignInDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SignInDropdown({ isOpen, onClose }: SignInDropdownProps) {
    const { signInWithGoogle } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            onClose();
        } catch (error) {
            console.error('Failed to sign in:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-3.5 px-2.5 border border-white/20">
            <div className="text-center mb-3.5">
                <h3 className="text-sm font-serif text-gray-900 mb-1">
                    Welcome to Admas Travel
                </h3>
                <p className="text-[10px] text-gray-600">
                    Sign in to access exclusive travel deals
                </p>
            </div>

            <button
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center gap-2 px-3 py-1.5 border border-gray-200/50 rounded-lg shadow-sm bg-white/80 hover:bg-white/90 text-gray-700 transition-all duration-200"
            >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-xs">Continue with Google</span>
            </button>

            <div className="mt-3.5 text-center">
                <p className="text-[9px] text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-forest hover:text-forest/90 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-forest hover:text-forest/90 underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
} 