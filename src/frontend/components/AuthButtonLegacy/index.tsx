import * as React from 'react';

type IAuthButtonProps = {
    bot: string;
};

const AuthButton: React.FC<IAuthButtonProps> = ({ bot }) => {
    const ref = React.createRef<HTMLDivElement>();

    React.useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://telegram.org/js/telegram-widget.js?15`;
        script.dataset.size = 'medium';
        script.dataset.telegramLogin = bot;
        script.dataset.authUrl = `${window.location.protocol}//${window.location.host}/auth/telegram`;
        ref.current?.appendChild(script);

        return () => {
            ref.current?.removeChild(script);
        };
    }, []);

    return (
        <div ref={ref} />
    );
};

export default AuthButton;
