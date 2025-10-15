import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
    const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

    return (
        <section id="about" className="container grid lg:grid-cols-2 gap-12 items-center py-20 md:py-32">
            <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
                    Muhammed Rashid
                </h1>
                <p className="text-xl md:text-2xl text-accent font-semibold">
                    Full-Stack .NET Developer
                </p>
                <p className="max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                    A passionate and detail-oriented Full-Stack Developer with expertise in the .NET ecosystem and modern frontend technologies. I specialize in building robust, scalable web applications and enjoy solving complex problems to deliver high-quality software solutions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="#projects">
                            View My Work 
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="#contact">
                            Get in Touch
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="flex justify-center">
                {heroImage && (
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        data-ai-hint={heroImage.imageHint}
                        width={400}
                        height={400}
                        className="rounded-full object-cover aspect-square shadow-2xl border-4 border-accent"
                        priority
                    />
                )}
            </div>
        </section>
    );
}
