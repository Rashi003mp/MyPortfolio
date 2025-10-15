import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { githubActivity } from '@/lib/data';
import { GitCommit } from 'lucide-react';
import Link from 'next/link';

export default function GithubSection() {
    return (
        <section id="github" className="container py-16 sm:py-20 md:py-28 px-4">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline">
                    Recent GitHub Activity
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mt-2">
                    A snapshot of my latest contributions.
                </p>
            </div>

            <div className="max-w-3xl mx-auto">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg sm:text-xl">
                            Activity Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4 sm:space-y-6">
                            {githubActivity.map((activity, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
                                >
                                    <span className="bg-accent/20 text-accent p-2 rounded-full mt-1 shrink-0">
                                        <GitCommit className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </span>
                                    <div className="flex-grow min-w-0">
                                        <p className="font-mono text-xs sm:text-sm text-muted-foreground break-words">
                                            <Link
                                                href={`https://github.com/${activity.repo}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-accent font-semibold transition-colors"
                                            >
                                                {activity.repo}
                                            </Link>
                                        </p>
                                        <p className="font-medium text-sm sm:text-base break-words">
                                            {activity.commit}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            {activity.time}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
