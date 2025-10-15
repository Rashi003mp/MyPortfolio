"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { submitContactForm } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {pending ? 'Sending...' : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
        </Button>
    );
}

export default function ContactSection() {
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useFormState(submitContactForm, initialState);
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message) {
            if (Object.keys(state.errors ?? {}).length === 0) {
                 toast({
                    title: "Success!",
                    description: state.message,
                });
                formRef.current?.reset();
            } else {
                 toast({
                    title: "Error",
                    description: state.message,
                    variant: "destructive",
                });
            }
        }
    }, [state, toast]);
    

    return (
        <section id="contact" className="container py-20 md:py-28 bg-primary/5">
            <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Get In Touch</h2>
                <p className="text-lg text-muted-foreground mt-2">
                    Have a question or want to work together? Feel free to reach out.
                </p>
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-headline">Contact Me</CardTitle>
                    <CardDescription>Fill out the form below and I'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={dispatch} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="Your Name" required aria-describedby="name-error" />
                            <div id="name-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="your.email@example.com" required aria-describedby="email-error" />
                             <div id="email-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" name="message" placeholder="Your message here..." required minLength={10} aria-describedby="message-error" />
                            <div id="message-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.message && <p className="text-sm text-destructive">{state.errors.message[0]}</p>}
                            </div>
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}
