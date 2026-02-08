// Lead form handling
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = leadForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        const formData = new FormData(leadForm);
        
        fetch('submit-form.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you! We have received your request and will contact you soon.');
                leadForm.reset();
            } else {
                alert('There was an error submitting your request. Please try again or email us directly at salvador.sena@quetzalcoro.com');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again or email us directly at salvador.sena@quetzalcoro.com');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Demo functionality
const startDemoButton = document.getElementById('start-demo');
const recognitionOutput = document.getElementById('recognition-output');

if (startDemoButton) {
    startDemoButton.addEventListener('click', function() {
        startDemo();
    });
}

function startDemo() {
    // Placeholder for demo functionality
    recognitionOutput.textContent = 'Demo started! Camera access would be requested here.';
    startDemoButton.textContent = 'Stop Demo';
    startDemoButton.style.backgroundColor = '#dc2626';
    
    // Simulate recognition after a delay
    setTimeout(() => {
        recognitionOutput.textContent = 'Recognition active... Waiting for sign language gestures.';
    }, 1000);
    
    // Add demo stop functionality
    startDemoButton.onclick = function() {
        stopDemo();
    };
}

function stopDemo() {
    recognitionOutput.textContent = 'Demo stopped. Click "Start Demo" to try again.';
    startDemoButton.textContent = 'Start Demo';
    startDemoButton.style.backgroundColor = '';
    startDemoButton.onclick = function() {
        startDemo();
    };
}

// Contact form handling - removed as lead form is used instead

// Add animation on scroll
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

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Active navigation highlight
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
