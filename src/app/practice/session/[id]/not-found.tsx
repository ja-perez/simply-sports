import CustomLink from '@/components/custom-link';
import SentimentVeryDissatisfied from '@mui/icons-material/SentimentVeryDissatisfied';

export default function NotFound() {
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2">
            <SentimentVeryDissatisfied className="w-10 text-gray-400" />
            <h2 className="text-xl font-semibold">404 Not Found</h2>
            <p>Could not find the requested match.</p>
            <CustomLink
                href="practice"
                key="practice-menu-link"
                {...{
                    className:"mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                }}
                >
                    Go Back
            </CustomLink>
        </main>
    )
}