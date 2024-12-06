import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError() as Error
    console.error(error)

    return (
        <div id="error-page">
            <h1>Error</h1>
            <p>Pahoittelut, jotain meni pieleen.</p>
            <p>
                <i>{error.message}</i>
            </p>
        </div>
    )
}