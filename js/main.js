document.addEventListener('DOMContentLoaded', ()=> {
	// year
	const y = document.getElementById('year');
	if (y) y.textContent = new Date().getFullYear();

	// nav toggle
	const toggle = document.getElementById('navToggle');
	const links = document.getElementById('navLinks');
	const header = document.querySelector('.nav-wrap');

	function closeNav(){
		if(links) links.classList.remove('open');
		if(toggle) toggle.setAttribute('aria-expanded','false');
		// restore page scroll
		document.body.style.overflow = '';
		// ensure header visible
		if(header) header.classList.remove('nav-hidden');
	}
	function openNav(){
		if(links) links.classList.add('open');
		if(toggle) toggle.setAttribute('aria-expanded','true');
		// prevent background scroll when menu open
		document.body.style.overflow = 'hidden';
		// ensure header visible while menu is open
		if(header) header.classList.remove('nav-hidden');
	}

	if(toggle){
		toggle.addEventListener('click', ()=>{
			const expanded = toggle.getAttribute('aria-expanded') === 'true';
			if(expanded) closeNav(); else openNav();
		});
	}

	// close nav when any nav link is clicked
	document.querySelectorAll('.nav-links a').forEach(a=>{
		a.addEventListener('click', ()=> {
			closeNav();
		});
	});

	// close menu on Escape
	document.addEventListener('keydown', (e)=>{
		if(e.key === 'Escape') closeNav();
	});

	// smooth scroll for anchor links
	document.querySelectorAll('a[href^="#"]').forEach(a=>{
		a.addEventListener('click', function(e){
			const target = document.querySelector(this.getAttribute('href'));
			if (target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'}); }
		});
	});

	// Hide header on scroll down, show on scroll up
	// throttle with requestAnimationFrame
	let lastScroll = window.scrollY || 0;
	let ticking = false;
	const HIDE_THRESHOLD = 60; // start hiding only after some scroll

	function onScrollUpdate(){
		const current = window.scrollY || 0;

		// if mobile menu is open, keep header visible
		const menuOpen = links && links.classList.contains('open');

		if(menuOpen){
			if(header) header.classList.remove('nav-hidden');
		} else {
			if (current <= 10) {
				// near top — always show
				if(header) header.classList.remove('nav-hidden');
			} else if (current > lastScroll && current > HIDE_THRESHOLD) {
				// scrolling down -> hide
				if(header) header.classList.add('nav-hidden');
			} else if (current < lastScroll) {
				// scrolling up -> show
				if(header) header.classList.remove('nav-hidden');
			}
		}

		lastScroll = current;
		ticking = false;
	}

	window.addEventListener('scroll', function(){
		if(!ticking){
			window.requestAnimationFrame(onScrollUpdate);
			ticking = true;
		}
	}, { passive: true });

	// close menu on Resize if desktop size to ensure state consistency
	window.addEventListener('resize', ()=>{
		if(window.innerWidth > 720) closeNav();
	});

	// Scroll to top button
	const scrollBtn = document.getElementById('scrollTopBtn');
	const SCROLL_THRESHOLD = 100;
	
	function toggleScrollButton() {
		const shouldShow = window.pageYOffset > SCROLL_THRESHOLD;
		console.log('Scroll position:', window.pageYOffset); // Debug log
		if (shouldShow) {
			scrollBtn.classList.add('visible');
		} else {
			scrollBtn.classList.remove('visible');
		}
	}

	// Check visibility immediately
	toggleScrollButton();

	// Throttled scroll handler
	window.addEventListener('scroll', () => {
		requestAnimationFrame(toggleScrollButton);
	}, { passive: true });

	// Scroll to top when clicked
	scrollBtn.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});

	// Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections except hero (which animates immediately)
    document.querySelectorAll('.section:not(.hero)').forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });

    // Scroll Animation Observer
    const animationObserverOptions = {
        threshold: 0.15,
        rootMargin: '50px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                animationObserver.unobserve(entry.target);
            }
        });
    }, animationObserverOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('fade-up');
        animationObserver.observe(el);
    });

    document.querySelectorAll('.service-card').forEach(el => {
        animationObserver.observe(el);
    });

    document.querySelectorAll('.work-item').forEach(el => {
        el.classList.add('fade-up');
        animationObserver.observe(el);
    });

    document.querySelectorAll('.hero-copy').forEach(el => {
        el.classList.add('fade-left');
        animationObserver.observe(el);
    });

    document.querySelectorAll('.hero-media').forEach(el => {
        el.classList.add('fade-right');
        animationObserver.observe(el);
    });
});
