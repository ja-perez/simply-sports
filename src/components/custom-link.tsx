import Link from 'next/link';


interface CustomLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function CustomLink({
    href, 
    children,
    ...rest
 }: CustomLinkProps) {
    const basePath = process.env.BASE_PATH || '';
    return (
        <Link href={basePath + href} {...rest}>
            {children}
        </Link>
    )
}