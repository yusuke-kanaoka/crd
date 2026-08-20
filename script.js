document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. ナビゲーションバーのスクロールエフェクト
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    const handleScroll = () => {
        // スクロール位置に応じてナビバーのスタイルを変更
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // アクティブリンクのハイライト
        const scrollY = window.scrollY;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                targetLink?.classList.add('active');
            } else {
                targetLink?.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================================
    // 2. スムーススクロール & 3. モバイルナビゲーション
    // ==========================================
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navbarHeight = navbar ? navbar.offsetHeight : 70;

    const closeMobileNav = () => {
        if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // アンカーリンクのスムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            closeMobileNav();
        });
    });

    // モバイルナビゲーションのトグル
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu?.classList.toggle('active');

            if (navMenu?.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // 外部クリックでモバイルナビを閉じる
    document.addEventListener('click', (e) => {
        if (navMenu?.classList.contains('active') && !navMenu.contains(e.target) && !navToggle?.contains(e.target)) {
            closeMobileNav();
        }
    });

    // ==========================================
    // 4. スクロールアニメーション (Intersection Observer)
    // ==========================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // 一度だけアニメーション
            }
        });
    }, observerOptions);

    animateElements.forEach(el => scrollObserver.observe(el));

    // ==========================================
    // 5. FAQアコーディオン
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const parentItem = question.parentElement;
            const answer = parentItem.querySelector('.faq-answer');
            const isActive = parentItem.classList.contains('active');

            // 他のFAQを閉じる（一度に一つだけ開く）
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.style.maxHeight = '0px';
            });

            // クリックしたアイテムを開く/閉じる
            if (!isActive) {
                parentItem.classList.add('active');
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ==========================================
    // 9. カウンターアニメーション
    // ==========================================
    const counterElements = document.querySelectorAll('.counter');
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2秒
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);
                let currentFrame = 0;

                // イージング関数
                const easeOutQuad = t => t * (2 - t);

                const counterInterval = setInterval(() => {
                    currentFrame++;
                    const progress = easeOutQuad(currentFrame / totalFrames);
                    const currentCount = Math.round(target * progress);

                    if (currentFrame === totalFrames) {
                        // 数値のフォーマット（カンマ区切り）
                        counter.innerText = target.toLocaleString();
                        clearInterval(counterInterval);
                    } else {
                        counter.innerText = currentCount.toLocaleString();
                    }
                }, frameDuration);

                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    });
    counterElements.forEach(counter => {
        counter.innerText = '0';
        counterObserver.observe(counter);
    });

    // 10. ヒーローセクションのパララックス風エフェクト（オーブ削除に伴い無効化）
});
