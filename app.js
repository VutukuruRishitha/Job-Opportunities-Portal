/**
 * TaskFlow Job Portal Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const contactForm = document.getElementById('contact-form');
    
    // Job Portal Elements
    const jobsContainer = document.getElementById('jobs-container');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-input');
    const locationFilter = document.getElementById('location-filter');
    const companyFilter = document.getElementById('company-filter');

    // State Management
    let allJobs = [];
    let filteredJobs = [];
    let currentPage = 1;
    const jobsPerPage = 5;

    // --- 1. Mobile Menu Toggle ---
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // --- 2. Dark Mode Toggle ---
    const checkTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    };
    checkTheme();

    themeToggle.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    // --- 3. Form Validation ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Name validation
            const nameInput = document.getElementById('name');
            if (nameInput.value.trim() === '') {
                nameInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('error');
            }

            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('error');
            }

            // Message validation
            const messageInput = document.getElementById('message');
            if (messageInput.value.trim() === '') {
                messageInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('error');
            }

            if (isValid) {
                // Simulate form submission
                const btn = contactForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Sending...';
                btn.disabled = true;

                setTimeout(() => {
                    // Create success message element
                    let successMsg = document.getElementById('success-msg');
                    if (!successMsg) {
                        successMsg = document.createElement('div');
                        successMsg.id = 'success-msg';
                        successMsg.style.marginTop = '20px';
                        successMsg.style.padding = '15px';
                        successMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                        successMsg.style.color = 'var(--secondary-color)';
                        successMsg.style.borderRadius = '8px';
                        successMsg.style.border = '1px solid var(--secondary-color)';
                        successMsg.style.textAlign = 'center';
                        successMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully.';
                        contactForm.appendChild(successMsg);
                    }
                    
                    contactForm.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    
                    // Remove message after 5 seconds
                    setTimeout(() => {
                        if (successMsg) successMsg.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }

    // --- 4. API Integration & Job Portal Logic ---

    // English Mock Data (Indian Context)
    const englishJobs = [
        { id: 1, title: 'Senior Frontend Developer', company: 'TCS', location: 'Bangalore', type: 'Full-time', description: 'We are looking for an experienced frontend developer to lead our core product team using React and modern CSS.', salary: '₹12,00,000 - ₹15,00,000' },
        { id: 2, title: 'UX/UI Designer', company: 'Wipro', location: 'Chennai', type: 'Contract', description: 'Join our design team to create stunning and user-friendly interfaces for our global clients.', salary: '₹8,00,000 - ₹10,00,000' },
        { id: 3, title: 'Backend Software Engineer', company: 'Infosys', location: 'Hyderabad', type: 'Full-time', description: 'Design and build scalable APIs and microservices using Node.js and PostgreSQL.', salary: '₹13,00,000 - ₹16,00,000' },
        { id: 4, title: 'Product Manager', company: 'Reliance', location: 'Mumbai', type: 'Full-time', description: 'Lead cross-functional teams to deliver high-impact features and drive product strategy.', salary: '₹18,00,000 - ₹24,00,000' },
        { id: 5, title: 'Marketing Specialist', company: 'TCS', location: 'Remote', type: 'Part-time', description: 'Help us grow our audience by managing social media campaigns and content strategy.', salary: '₹5,00,000 - ₹7,00,000' },
        { id: 6, title: 'Data Scientist', company: 'Infosys', location: 'Chennai', type: 'Full-time', description: 'Analyze complex datasets to provide actionable insights and build predictive models.', salary: '₹14,00,000 - ₹18,00,000' },
        { id: 7, title: 'DevOps Engineer', company: 'Reliance', location: 'Mumbai', type: 'Full-time', description: 'Maintain and optimize our cloud infrastructure using AWS, Docker, and Kubernetes.', salary: '₹15,00,000 - ₹20,00,000' },
        { id: 8, title: 'Technical Support Specialist', company: 'TCS', location: 'Remote', type: 'Full-time', description: 'Provide world-class technical support to our enterprise customers worldwide.', salary: '₹4,00,000 - ₹6,00,000' },
        { id: 9, title: 'Full Stack Developer', company: 'Wipro', location: 'Hyderabad', type: 'Contract', description: 'Work on diverse projects requiring both frontend flair and robust backend architecture.', salary: '₹10,00,000 - ₹14,00,000' },
        { id: 10, title: 'HR Manager', company: 'Reliance', location: 'Chennai', type: 'Full-time', description: 'Oversee recruitment, employee relations, and organizational development initiatives.', salary: '₹12,00,000 - ₹16,00,000' },
        { id: 11, title: 'Mobile App Developer', company: 'Infosys', location: 'Remote', type: 'Full-time', description: 'Develop performant iOS and Android applications using React Native.', salary: '₹11,00,000 - ₹15,00,000' },
        { id: 12, title: 'Quality Assurance Tester', company: 'TCS', location: 'Bangalore', type: 'Part-time', description: 'Ensure software quality by writing and executing manual and automated tests.', salary: '₹6,00,000 - ₹8,00,000' }
    ];

    const renderSkeletons = () => {
        let skeletonsHTML = '';
        for (let i = 0; i < jobsPerPage; i++) {
            skeletonsHTML += `
                <div class="skeleton-card">
                    <div class="job-info" style="width: 100%">
                        <div class="skeleton skeleton-title"></div>
                        <div class="job-meta">
                            <div class="skeleton skeleton-text skeleton-meta"></div>
                            <div class="skeleton skeleton-text skeleton-meta"></div>
                        </div>
                        <div class="skeleton skeleton-desc"></div>
                    </div>
                    <div class="job-action">
                        <div class="skeleton skeleton-btn"></div>
                    </div>
                </div>
            `;
        }
        jobsContainer.innerHTML = skeletonsHTML;
        paginationContainer.innerHTML = '';
    };

    const renderErrorState = () => {
        jobsContainer.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h3>Failed to load jobs</h3>
                <p>There was a problem connecting to our servers. Please try again later.</p>
                <button class="btn btn-outline" onclick="location.reload()" style="margin-top: 15px;">Retry</button>
            </div>
        `;
        paginationContainer.innerHTML = '';
    };

    const renderJobs = () => {
        if (filteredJobs.length === 0) {
            jobsContainer.innerHTML = `
                <div class="error-state" style="border-color: var(--border-color);">
                    <i class="fa-solid fa-magnifying-glass" style="color: var(--text-muted)"></i>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
            paginationContainer.innerHTML = '';
            return;
        }

        const startIndex = (currentPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        const jobsToDisplay = filteredJobs.slice(startIndex, endIndex);

        let jobsHTML = '';
        jobsToDisplay.forEach(job => {
            jobsHTML += `
                <div class="job-card">
                    <div class="job-info">
                        <h3 class="job-title">${job.title}</h3>
                        <div class="job-meta">
                            <span class="company-name"><i class="fa-regular fa-building"></i> ${job.company}</span>
                            <span class="location"><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                            <span class="job-type"><i class="fa-solid fa-briefcase"></i> ${job.type}</span>
                            <span class="salary"><i class="fa-solid fa-sack-dollar"></i> ${job.salary}</span>
                        </div>
                        <p class="job-desc">${job.description}</p>
                    </div>
                    <div class="job-action">
                        <button class="btn btn-primary" aria-label="Apply for ${job.title}">Apply Now</button>
                    </div>
                </div>
            `;
        });

        jobsContainer.innerHTML = jobsHTML;
        renderPagination();
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // Prev button
        paginationHTML += `
            <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="window.changePage(${currentPage - 1})" aria-label="Previous page">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
        `;

        // Page numbers (limit to max 5 for UI simplicity)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-btn ${currentPage === i ? 'active' : ''}" onclick="window.changePage(${i})">${i}</button>
            `;
        }

        // Next button
        paginationHTML += `
            <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="window.changePage(${currentPage + 1})" aria-label="Next page">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        `;

        paginationContainer.innerHTML = paginationHTML;
    };

    // Expose changePage to global scope for inline onclick handlers
    window.changePage = (page) => {
        const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            renderJobs();
            // Scroll to top of jobs section
            document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
        }
    };

    const filterJobs = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const locationTerm = locationFilter.value;
        const companyTerm = companyFilter.value;

        filteredJobs = allJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm) || job.description.toLowerCase().includes(searchTerm);
            const matchesLocation = locationTerm === '' || job.location === locationTerm;
            const matchesCompany = companyTerm === '' || job.company === companyTerm;
            
            return matchesSearch && matchesLocation && matchesCompany;
        });

        currentPage = 1; // Reset to first page
        renderJobs();
    };

    // Event listeners for filters
    searchInput.addEventListener('input', filterJobs);
    locationFilter.addEventListener('change', filterJobs);
    companyFilter.addEventListener('change', filterJobs);

    // Fetch Data
    const fetchJobs = async () => {
        renderSkeletons();
        
        try {
            // Using setTimeout to artificially delay and show skeletons
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Assign English jobs instead of fetching Latin text
            allJobs = englishJobs;
            filteredJobs = [...allJobs];
            renderJobs();
            
        } catch (error) {
            console.error('Error fetching jobs:', error);
            renderErrorState();
        }
    };

    // Initialize fetching
    fetchJobs();
});
