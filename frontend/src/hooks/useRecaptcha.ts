import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export function useRecaptcha() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const executeRecaptchaVerification = async (action: string) => {
        if (!executeRecaptcha) {
            console.warn('reCAPTCHA has not been loaded');
            return null;
        }

        try {
            const token = await executeRecaptcha(action);
            return token;
        } catch (error) {
            console.error('reCAPTCHA execution failed:', error);
            return null;
        }
    };

    return { executeRecaptchaVerification };
} 