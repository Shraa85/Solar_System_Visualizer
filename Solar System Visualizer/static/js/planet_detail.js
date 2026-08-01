document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach((item, index) => {
        const header = item.querySelector('.accordion-header');
        const body = item.querySelector('.accordion-body');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            if (isActive) {
                item.classList.remove('active');
                body.style.maxHeight = null;
                return;
            }

            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        });

        if (index === 0) {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    });
});