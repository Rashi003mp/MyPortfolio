"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { skills } from '@/lib/data';
import { Code, Github, Sparkles } from 'lucide-react';
import { CsharpIcon, DotNetIcon, ReduxIcon, SqlIcon } from './icons';

function ReactIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
            <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
            <g stroke="#61DAFB" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2"/>
                <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
            </g>
        </svg>
    );
}

const iconMap: { [key: string]: React.ElementType } = {
    'React': ReactIcon,
    'Redux': ReduxIcon,
    '.NET': DotNetIcon,
    'ASP.NET Core': DotNetIcon,
    'SQL': SqlIcon,
    'C#': CsharpIcon,
    'Git': Github,
    'GitHub': Github,
    'default': Code,
};

export default function SkillsSection() {
    const skillCategories = {
        'Frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'Redux'],
        'Backend': ['.NET', 'ASP.NET Core', 'SQL'],
        'Languages & Tools': ['C#', 'Git', 'GitHub', 'Visual Studio', 'VS Code'],
    };

    return (
        <section id="skills" className="container py-20 md:py-28">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">My Tech Stack</h2>
                <p className="text-lg text-muted-foreground mt-2">Technologies I use to build modern web applications.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(skillCategories).map(([category, skillNames]) => (
                    <Card key={category} className="bg-card border-border/60">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                                <Sparkles className="text-accent"/>
                                {category}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {skillNames.map((skillName) => {
                                    const IconComponent = iconMap[skillName] || iconMap.default;
                                    
                                    return (
                                        <div key={skillName} className="flex items-center gap-2 bg-background p-2 rounded-md border border-border">
                                            <IconComponent className="h-6 w-6" />
                                            <span className="font-medium">{skillName}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
