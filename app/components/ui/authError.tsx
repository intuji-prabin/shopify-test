import { useSubmit } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { RouteError } from '~/components/ui/route-error';

export function AuthError({ errorMessage }: { errorMessage?: string }) {
    const logOutButtonRef = useRef<HTMLButtonElement>(null);
    const submit = useSubmit();
    useEffect(() => {
        if (typeof window === "undefined" || !logOutButtonRef.current) return;
        logOutButtonRef.current.click();
    }, [])
    return (
        <section className="container">
            <RouteError errorMessage={errorMessage} />
            <button hidden onClick={() => {
                const formData = new FormData();
                formData.append('_action', 'unauthorized');
                submit(formData, { method: 'post', action: '/logout' })
            }} ref={logOutButtonRef} ></button>
        </section>
    );
}