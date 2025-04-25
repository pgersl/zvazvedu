fetch('/json/speakers.json')
    .then(response => response.json())
    .then(speakers => {
        const container = document.getElementById('speakers-container');
        const template = document.getElementById('speaker-template');

        speakers.forEach(speaker => {
            const clone = template.content.cloneNode(true);

            const speakerElement = clone.querySelector('.speaker');
            if (speaker.locations && Array.isArray(speaker.locations)) {
                const locationClasses = speaker.locations.map(location => `location-${location.toLowerCase()}`);
                speakerElement.classList.add(...locationClasses);
            }


            clone.querySelector('.speaker-photo').src = speaker.photo;
            clone.querySelector('.speaker-photo').alt = speaker.name;
            clone.querySelector('.speaker-name').textContent = speaker.name;
            clone.querySelector('.speaker-bio-text').textContent = speaker.bio;

            const lectureList = clone.querySelector('.speaker-lectures');
            speaker.lectures.forEach(lecture => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = lecture.youtube;
                a.textContent = lecture.title;
                a.target = "_blank";
                li.appendChild(a);
                lectureList.appendChild(li);
            });

            const contacts = clone.querySelector('.speaker-contacts');
            ['website', 'instagram', 'linkedin', 'facebook'].forEach(key => {
                const link = clone.querySelector(`.${key}`);
                if (speaker.contact && speaker.contact[key]) {
                    link.href = speaker.contact[key];
                } else {
                    link.remove();
                }
            });
            if (contacts.children.length === 0) {
                contacts.remove();
            }

            if (!speaker.bio) {
                const speakerBio = clone.querySelector('.speaker-bio');
                speakerBio.remove();
            }

            container.appendChild(clone);
        });
    });


document.getElementById('speakers-container').addEventListener('click', event => {
    const revealButton = event.target.closest('.reveal-button');
    if (!revealButton) return;

    const speakerBio = revealButton.closest('.speaker-bio');
    if (!speakerBio) return;

    const text = speakerBio.querySelector('.speaker-bio-text');
    const label = revealButton.querySelector('.reveal-button-label');
    const icon = revealButton.querySelector('i');

    const isHidden = text.style.display === 'none' || text.style.display === '';

    text.style.display = isHidden ? 'block' : 'none';
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
    label.textContent = isHidden ? 'Méně' : 'Více';
});

const speakerSearch = document.getElementById('speaker-search');
speakerSearch.addEventListener('input', () => {
    const searchValue = speakerSearch.value.toLowerCase();
    const speakers = document.querySelectorAll('.speaker');
    speakers.forEach(speaker => {
        const speakerName = speaker.querySelector('.speaker-name').textContent.toLowerCase();
        if (speakerName.includes(searchValue)) {
            speaker.style.display = 'flex';
        } else {
            speaker.style.display = 'none';
        }
    });
});

const locationFilters = document.querySelectorAll('.speaker-filters-container input');
locationFilters.forEach(filter => {
    filter.addEventListener('change', () => {
        const activeFilters = Array.from(locationFilters)
            .filter(f => f.checked)
            .map(f => f.id);
        const speakers = document.querySelectorAll('.speaker');
        const mapRegions = document.querySelectorAll('.map-region');
        speakers.forEach(speaker => {
            if (activeFilters.length === 0) {
                speaker.style.display = 'flex';
                return;
            }
            const hasMatch = activeFilters.some(filterClass => speaker.classList.contains(filterClass));
            speaker.style.display = hasMatch ? 'flex' : 'none';
        });
        mapRegions.forEach(region => {
            if (activeFilters.length === 0) {
                region.style.fill = 'var(--accent)';
                return;
            }
            const hasMatch = activeFilters.some(filterClass => region.classList.contains(filterClass));
            region.style.fill = hasMatch ? 'var(--accent)' : 'var(--accent20)';
        });
    });
});