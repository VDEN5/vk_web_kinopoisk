import React, {
    ChangeEvent,
    FormEvent,
    useState,
    useEffect,
    useRef,
} from 'react';
import { Alert, Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../const';
import { useAuth } from '../components/auth-context';

export function LoginForm(): JSX.Element {
    const [inputPassword, setInputPassword] = useState<string>('');
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const { setAuthStatus } = useAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const hardCodedPassword = '';

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputPassword(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inputPassword === hardCodedPassword) {
            setAuthStatus(AuthorizationStatus.Auth);
            if (isMounted.current) {
                navigate(AppRoute.Root);
            }
        } else {
            setIsAuthorized(false);
        }
    };

    return (
        <div className="p-3">
            <Container className="pt-5">
                <h3 className="mb-3">Старт приложения</h3>
                <div className="mb-3">
                    Нажмите на кнопку для запуска приложения
                </div>
                <Form onSubmit={handleSubmit}>
                    <Button variant="primary" type="submit">
                        Начать
                    </Button>
                </Form>
                {isAuthorized !== null && (
                    <Alert
                        variant={isAuthorized ? 'success' : 'danger'}
                        className="mt-3"
                    >
                        {isAuthorized
                            ? 'Введен правильный пароль'
                            : 'Введен неправильный пароль'}
                    </Alert>
                )}
            </Container>
        </div>
    );
}
