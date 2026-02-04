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

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navbar = document.querySelector('.navbar__nav');
    
    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navbar.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    }

    // Custom form handling with success/error messages
    const inquiryForm = document.getElementById('inquiryForm');
    const subscribeForm = document.querySelector('.site-footer__form');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const messageDiv = document.getElementById('form-message');
            const button = inquiryForm.querySelector('.btn-submit');
            const originalText = button.textContent;
            
            // Set reply-to email from form data
            const emailInput = inquiryForm.querySelector('input[name="email"]');
            const replyToField = inquiryForm.querySelector('input[name="replyto"]');
            
            if (emailInput && replyToField) {
                replyToField.value = emailInput.value;
            }
            
            // Show loading state
            button.textContent = 'Sending...';
            button.disabled = true;
            messageDiv.style.display = 'none';
            
            try {
                const formData = new FormData(inquiryForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    // Success message
                    messageDiv.innerHTML = '✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon!';
                    messageDiv.className = 'form-message success show';
                    messageDiv.style.display = 'block';
                    inquiryForm.reset();
                    
                    button.textContent = 'Message Sent!';
                    button.style.background = '#1da851';
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Error message
                messageDiv.innerHTML = '❌ Sorry, there was an error sending your message. Please try again or contact us directly.';
                messageDiv.className = 'form-message error show';
                messageDiv.style.display = 'block';
                
                button.textContent = 'Try Again';
                button.style.background = '#dc3545';
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
            }, 3000);
        });
    }

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const messageDiv = document.getElementById('subscribe-message');
            const button = subscribeForm.querySelector('.site-footer__submit');
            const originalText = button.textContent;
            
            // Set reply-to email from form data
            const emailInput = subscribeForm.querySelector('input[name="email"]');
            const replyToField = subscribeForm.querySelector('input[name="replyto"]');
            
            if (emailInput && replyToField) {
                replyToField.value = emailInput.value;
            }
            
            // Show loading state
            button.textContent = 'Sending...';
            button.disabled = true;
            messageDiv.style.display = 'none';
            
            try {
                const formData = new FormData(subscribeForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    // Success message
                    messageDiv.innerHTML = '✅ Successfully subscribed!';
                    messageDiv.className = 'form-message success show';
                    messageDiv.style.display = 'block';
                    subscribeForm.reset();
                    
                    button.textContent = 'Subscribed!';
                    button.style.background = '#1da851';
                } else {
                    throw new Error('Failed to subscribe');
                }
            } catch (error) {
                // Error message
                messageDiv.innerHTML = '❌ Error subscribing. Please try again.';
                messageDiv.className = 'form-message error show';
                messageDiv.style.display = 'block';
                
                button.textContent = 'Try Again';
                button.style.background = '#dc3545';
            }
            
            // Reset button after 3 seconds
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
