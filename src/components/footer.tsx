import { socialLinks } from '@/lib/data';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-primary/10 border-t border-border/40">
            <div className="container py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Muhammed Rashid. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    {socialLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-accent transition-colors"
                            aria-label={link.name}
                        >
                            <link.icon className="h-6 w-6" />
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
