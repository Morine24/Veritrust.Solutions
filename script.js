let supabaseClient;

function initSupabase() {
    const SUPABASE_URL = 'https://cwvcyocjygmcwyuqzwzs.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3dmN5b2NqeWdtY3d5dXF6d3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MDY5NjIsImV4cCI6MjA4Mzk4Mjk2Mn0.tGfs1WrYgGQ-TeLzPIPPj0ccvuGlmf-zKxs3uU45Zio';
    
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized successfully');
    } else {
        console.error('Supabase library not loaded');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initSupabase();

    const subscribeForms = document.querySelectorAll('.site-footer__form');
    subscribeForms.forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const input = form.querySelector('input[type="email"], .site-footer__input');
            const button = form.querySelector('.site-footer__submit');
            const email = (input?.value || '').trim();

            if (!email) {
                alert('Please enter your email to subscribe.');
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;

            try {
                const response = await fetch('https://formspree.io/f/xlggdgdq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        _subject: 'New Newsletter Subscription',
                        message: `New subscriber: ${email}`
                    })
                });

                if (response.ok) {
                    button.textContent = 'Subscribed!';
                    button.style.background = '#1da851';
                    form.reset();
                    alert('Thank you for subscribing! Confirmation sent to veritrust09@gmail.com');
                } else {
                    throw new Error('Failed to subscribe');
                }
            } catch (err) {
                button.textContent = 'Error';
                button.style.background = '#dc3545';
                alert('Error subscribing. Please try again.');
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 3000);
        });
    });
    
    const inquiryForm = document.getElementById('inquiryForm');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const button = inquiryForm.querySelector('.btn-submit');
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;

            const formData = {
                name: inquiryForm.name.value,
                email: inquiryForm.email.value,
                phone: inquiryForm.phone.value,
                company: inquiryForm.company.value,
                message: inquiryForm.message.value
            };

            try {
                // Submit to Formspree for email delivery
                const formspreeResponse = await fetch('https://formspree.io/f/xlggdgdq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Also save to Supabase database
                const { data, error } = await supabaseClient
                    .schema('public')
                    .from('inquiries')
                    .insert([formData]);

                if (formspreeResponse.ok) {
                    button.textContent = 'Message Sent!';
                    button.style.background = '#1da851';
                    inquiryForm.reset();
                    alert('Thank you! Your message has been sent to veritrust09@gmail.com');
                } else {
                    throw new Error('Failed to send email');
                }

                if (error) {
                    console.error('Database Error:', error);
                }

            } catch (err) {
                button.textContent = 'Error. Try again';
                button.style.background = '#dc3545';
                console.error('Form submission error:', err);
                alert('Error sending message. Please try again or contact us directly.');
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 3000);
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .step, .benefit, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
