import AuthGuard from '../../components/Auth/AuthGuard';
import TextForm from '../../components/Text/TextForm';

export default function NewTextPage() {
    return (
        <AuthGuard>
            <TextForm />
        </AuthGuard>
    );
}
