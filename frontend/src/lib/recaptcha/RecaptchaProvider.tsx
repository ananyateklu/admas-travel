import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

interface RecaptchaProviderProps {
    children: React.ReactNode;
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}

