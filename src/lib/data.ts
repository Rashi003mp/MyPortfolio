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
        description: 'A full-featured e-commerce platform built with ASP.NET Core for the backend and React for the frontend. Includes product management, user authentication, and a shopping cart.',
        tech: ['ASP.NET Core', 'React', 'SQL Server', 'Redux'],
        image: '1',
        githubUrl: 'https://github.com',
        liveUrl: '#',
    },
    {
        id: 'proj2',
        title: 'Task Management API',
        description: 'A RESTful API for a task management application. Users can create, read, update, and delete tasks and projects. Secured with JWT authentication.',
        tech: ['.NET', 'C#', 'SQL', 'JWT'],
        image: '2',
        githubUrl: 'https://github.com',
        liveUrl: null,
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
    {
        id: 'proj4',
        title: 'Inventory Management System',
        description: 'A desktop application for managing inventory, suppliers, and orders. Developed using Windows Forms and connected to a SQL database.',
        tech: ['.NET', 'C#', 'SQL'],
        image: '4',
        githubUrl: 'https://github.com',
        liveUrl: null,
    }
];

export const githubActivity = [
    {
        repo: 'muhammed-rashid/ecommerce-platform',
        commit: 'feat: Implement JWT authentication middleware',
        time: '2 hours ago',
    },
    {
        repo: 'muhammed-rashid/task-manager-api',
        commit: 'fix: Correct pagination logic in task controller',
        time: '1 day ago',
    },
    {
        repo: 'muhammed-rashid/portfolio-nextjs',
        commit: 'chore: Update dependencies and refactor layout',
        time: '3 days ago',
    },
    {
        repo: 'muhammed-rashid/ecommerce-platform',
        commit: 'docs: Add API documentation for products endpoint',
        time: '5 days ago',
    }
];

export const socialLinks = [
    { name: 'GitHub', url: 'https://github.com', icon: Github },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
    { name: 'Email', url: 'mailto:muhammed.rashid@example.com', icon: Mail },
];
