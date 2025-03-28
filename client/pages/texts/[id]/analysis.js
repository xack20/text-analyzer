import { useRouter } from 'next/router';
import AuthGuard from '../../../components/Auth/AuthGuard';
import TextAnalysis from '../../../components/Text/TextAnalysis';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';

export default function TextAnalysisPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) {
        return <LoadingSpinner />;
    }

    return (
        <AuthGuard>
            <TextAnalysis textId={id} />
        </AuthGuard>
    );
}
