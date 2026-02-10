/**
 * ContactForm
 * Handles contact form submission with EmailJS integration
 */

class ContactForm {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.statusEl = null;
        this.isInitialized = false;

        // EmailJS Configuration
        // IMPORTANT: Replace these with your actual EmailJS credentials
        this.emailjsConfig = {
            serviceId: 'service_1zy39v4',    // Replace with your EmailJS service ID
            templateId: 'template_jgu4w2f',  // Replace with your EmailJS template ID
            publicKey: 'SeDa3wLRCtoA8bPaN'     // Replace with your EmailJS public key
        };
    }

    /**
     * Initialize contact form
     */
    init() {
        if (this.isInitialized) return this;

        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.statusEl = document.getElementById('form-status');

        if (!this.form) return null;

        // Load EmailJS library
        this.loadEmailJS();

        // Attach form submit handler
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.isInitialized = true;
        console.log('📧 ContactForm initialized');
        return this;
    }

    /**
     * Load EmailJS library dynamically
     */
    loadEmailJS() {
        if (window.emailjs) return;

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            console.log('✅ EmailJS loaded');
            // Initialize EmailJS with your public key
            emailjs.init(this.emailjsConfig.publicKey);
        };
        document.head.appendChild(script);
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject') || 'Contact Form Submission',
            message: formData.get('message')
        };

        // Set loading state
        this.setLoadingState(true);
        this.hideStatus();

        try {
            // Check if EmailJS is configured
            if (!this.isConfigured()) {
                throw new Error('EmailJS is not configured. Please add your EmailJS credentials.');
            }

            // Send email using EmailJS
            await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId,
                {
                    from_name: data.name,
                    from_email: data.email,
                    subject: data.subject,
                    message: data.message,
                    to_name: 'Portfolio Owner' // Customize as needed
                }
            );

            // Show success message
            this.showStatus('success', '✅ Message sent successfully! I\'ll get back to you soon.');

            // Reset form
            this.form.reset();

        } catch (error) {
            console.error('Form submission error:', error);

            // Show custom error messages
            let errorMessage = '❌ Failed to send message. ';

            if (error.message.includes('not configured')) {
                errorMessage += 'Please configure EmailJS credentials in ContactForm.js';
            } else if (error.text) {
                errorMessage += error.text;
            } else {
                errorMessage += 'Please try again later or email directly.';
            }

            this.showStatus('error', errorMessage);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Validate form inputs
     */
    validateForm() {
        const nameInput = this.form.querySelector('#name');
        const emailInput = this.form.querySelector('#email');
        const messageInput = this.form.querySelector('#message');

        // Basic validation
        if (!nameInput.value.trim()) {
            this.showStatus('error', 'Please enter your name');
            nameInput.focus();
            return false;
        }

        if (!emailInput.value.trim() || !this.isValidEmail(emailInput.value)) {
            this.showStatus('error', 'Please enter a valid email address');
            emailInput.focus();
            return false;
        }

        if (!messageInput.value.trim()) {
            this.showStatus('error', 'Please enter a message');
            messageInput.focus();
            return false;
        }

        return true;
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Check if EmailJS is configured
     */
    isConfigured() {
        return (
            this.emailjsConfig.serviceId !== 'YOUR_SERVICE_ID' &&
            this.emailjsConfig.templateId !== 'YOUR_TEMPLATE_ID' &&
            this.emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY'
        );
    }

    /**
     * Set loading state
     */
    setLoadingState(loading) {
        if (loading) {
            this.submitBtn.classList.add('is-loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('is-loading');
            this.submitBtn.disabled = false;
        }
    }

    /**
     * Show status message
     */
    showStatus(type, message) {
        const messageEl = this.statusEl.querySelector('.form-status__message');
        messageEl.textContent = message;

        this.statusEl.classList.remove('is-success', 'is-error');
        this.statusEl.classList.add(`is-${type}`, 'is-visible');

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => this.hideStatus(), 5000);
        }
    }

    /**
     * Hide status message
     */
    hideStatus() {
        this.statusEl.classList.remove('is-visible');
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.form) {
            this.form.removeEventListener('submit', this.handleSubmit);
        }
        this.isInitialized = false;
    }
}

export const contactForm = new ContactForm();
export default ContactForm;
