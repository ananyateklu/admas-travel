import { useAuth } from '../lib/firebase/AuthContext';

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
        <div className="absolute right-0 mt-2 w-80 bg-white/70 backdrop-blur-lg rounded-[1.2rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] py-6 px-4">
            <div className="text-center mb-6">
                <h3 className="text-xl font-serif text-gray-900 mb-2">
                    Welcome to Admas Travel
                </h3>
                <p className="text-sm text-gray-600">
                    Sign in to access exclusive travel deals and personalized recommendations
                </p>
            </div>

            <button
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-gray-200/20 rounded-[1.2rem] shadow-sm bg-white/50 hover:bg-white/80 text-gray-700 transition-all duration-200"
            >
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                        d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                        fill="currentColor"
                    />
                </svg>
                Continue with Google
            </button>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-gold hover:text-gold/90 underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-gold hover:text-gold/90 underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
} 