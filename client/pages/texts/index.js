import AuthGuard from '../../components/Auth/AuthGuard';
import TextList from '../../components/Text/TextList';

export default function TextsPage() {
    return (
        <AuthGuard>
            <TextList />
        </AuthGuard>
    );
}
