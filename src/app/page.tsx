import TopBarNav from '@/components/top-bar-nav';
import { Hero, Features, Background } from '@/components/home';


export default function Home() {
    return (
        <main>
			<TopBarNav />
			<Hero />
			<Features />
			<Background />
        </main>
    );
}