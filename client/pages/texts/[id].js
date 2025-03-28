import { useRouter } from 'next/router';
import AuthGuard from '../../components/Auth/AuthGuard';
import TextDetail from '../../components/Text/TextDetail';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

export default function TextDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) {
        return <LoadingSpinner />;
    }

    return (
        <AuthGuard>
            <TextDetail textId={id} />
        </AuthGuard>
    );
}
