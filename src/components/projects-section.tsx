import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { projects } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';

export default function ProjectsSection() {
    return (
        <section id="projects" className="container py-20 md:py-28 bg-primary/5">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Projects Portfolio</h2>
                <p className="text-lg text-muted-foreground mt-2">A selection of my recent work.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => {
                    const projectImage = PlaceHolderImages.find(img => img.id === project.image);
                    return (
                        <Card key={project.id} className="flex flex-col overflow-hidden hover:border-accent transition-colors">
                            {projectImage && (
                                <div className="overflow-hidden">
                                     <Image
                                        src={projectImage.imageUrl}
                                        alt={project.title}
                                        data-ai-hint={projectImage.imageHint}
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.tech.map((tech) => (
                                        <Badge key={tech} variant="secondary">{tech}</Badge>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{project.description}</p>
                            </CardContent>
                            <CardFooter className="gap-4">
                                <Button asChild variant="outline">
                                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="mr-2 h-4 w-4" />
                                        Source Code
                                    </Link>
                                </Button>
                                {project.liveUrl && (
                                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Live Demo
                                        </Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
