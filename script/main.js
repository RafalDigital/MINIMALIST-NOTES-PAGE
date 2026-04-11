const slider = document.querySelector('.slider');
        const items = document.querySelectorAll('.menu-item');
        const wrapper = document.querySelector('.menu-wrapper');

        function moveSlider(element) {
            const rect = element.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();

            // Set lebar dan posisi kiri secara presisi
            slider.style.width = rect.width + 'px';
            slider.style.left = (rect.left - wrapperRect.left) + 'px';
        }

        // Jalankan saat pertama kali buka
        window.onload = () => {
            const active = document.querySelector('.menu-item.active');
            moveSlider(active);
        };

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                moveSlider(item);
            });
        });

        // Update posisi kalau layar di-resize (penting!)
        window.addEventListener('resize', () => {
            const active = document.querySelector('.menu-item.active');
            moveSlider(active);
        });