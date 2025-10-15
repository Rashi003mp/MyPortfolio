import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { githubActivity } from '@/lib/data';
import { GitCommit } from 'lucide-react';
import Link from 'next/link';

export default function GithubSection() {
    return (
        <section id="github" className="container py-20 md:py-28">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Recent GitHub Activity</h2>
                <p className="text-lg text-muted-foreground mt-2">A snapshot of my latest contributions.</p>
            </div>
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Activity Feed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-6">
                            {githubActivity.map((activity, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <span className="bg-accent/20 text-accent p-2 rounded-full mt-1">
                                        <GitCommit className="h-5 w-5" />
                                    </span>
                                    <div className="flex-grow">
                                        <p className="font-mono text-sm text-muted-foreground">
                                            <Link href={`https://github.com/${activity.repo}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent font-semibold transition-colors">{activity.repo}</Link>
                                        </p>
                                        <p className="font-medium">{activity.commit}</p>
                                        <p className="text-sm text-muted-foreground">{activity.time}</p>
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
