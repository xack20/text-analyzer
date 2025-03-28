import { useRouter } from 'next/router';
import AuthGuard from '../../../components/Auth/AuthGuard';
import TextForm from '../../../components/Text/TextForm';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';

export default function EditTextPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) {
        return <LoadingSpinner />;
    }

    return (
        <AuthGuard>
            <TextForm textId={id} />
        </AuthGuard>
    );
}
