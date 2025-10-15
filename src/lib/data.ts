import { Github, Code, ExternalLink, Mail, Linkedin } from 'lucide-react';
import { CsharpIcon, DotNetIcon, SqlIcon, ReduxIcon } from '@/components/icons';

export const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
];

export const skills = [
    { name: 'HTML', icon: Code },
    { name: 'CSS', icon: Code },
    { name: 'JavaScript', icon: Code },
    { name: 'React', icon: 'react' },
    { name: 'Redux', icon: ReduxIcon },
    { name: '.NET', icon: DotNetIcon },
    { name: 'ASP.NET Core', icon: DotNetIcon },
    { name: 'SQL', icon: SqlIcon },
    { name: 'C#', icon: CsharpIcon },
    { name: 'Git', icon: Github },
    { name: 'GitHub', icon: Github },
    { name: 'Visual Studio', icon: Code },
    { name: 'VS Code', icon: Code },
];

export const projects = [
    {
        id: 'proj1',
        title: 'E-commerce Platform',
        description: "An academic e-commerce project built with React and JSON Server, featuring product management, user authentication, shopping cart, wishlist, and order placement.",
        tech: [ 'React', 'Tailwind', 'Redux'],
        image: '1',
        githubUrl: 'https://github.com',
        liveUrl: '#',
    },
       {
        id: 'proj3',
        title: 'Personal Portfolio Website',
        description: 'A responsive personal portfolio website to showcase skills and projects. Built with Next.js and styled with Tailwind CSS.',
        tech: ['React', 'Next.js', 'Tailwind CSS'],
        image: '3',
        githubUrl: 'https://github.com',
        liveUrl: '#',
    },
    
];

export const githubActivity = [
    {
        repo: 'https://github.com/Rashi003mp/jenogram',
        commit: 'feat: Frontend Completed',
        time: '2 hours ago',
    },
    
    {
        repo: 'https://github.com/Rashi003mp/MyPortfolio',
        commit: 'chore: Update dependencies and refactor layout',
        time: '3 days ago',
    },
    
];

export const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/Rashi003mp', icon: Github },
    { name: 'LinkedIn', url: 'www.linkedin.com/in/rashid-rashi', icon: Linkedin },
    { name: 'Email', url: 'mailto:muhammedrashidr222@gmail.com', icon: Mail },
];
