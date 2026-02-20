'use strict';

// =============================
// DOM SELECTORS
// =============================

const workCategories = document.querySelector('.work__categories');
const workProjects = document.querySelectorAll('.work__project');
const projectsContainer = document.querySelector('.projects');

const studyCategories = document.querySelector('.study__categories');
const studyProjects = document.querySelectorAll('.study__project');

// =============================
// WORK FILTER
// =============================

if (workCategories) {
    workCategories.addEventListener('click', (event) => {

        const button = event.target.closest('.work__category');
        if (!button) return;

        const filter = button.dataset.category;
        if (!filter) return;

        moveCategorySelection(button, '.work__category.category--selected');
        filterProjects(filter, workProjects, projectsContainer);
    });
}

// =============================
// STUDY FILTER
// =============================

if (studyCategories) {
    studyCategories.addEventListener('click', (event) => {

        const button = event.target.closest('.study__category');
        if (!button) return;

        const filter = button.dataset.category;
        if (!filter) return;

        moveCategorySelection(button, '.study__category.category--selected');
        filterProjects(filter, studyProjects, null);
    });
}

// =============================
// MOVE ACTIVE BUTTON
// =============================

function moveCategorySelection(target, activeSelector) {
    const active = document.querySelector(activeSelector);
    if (active) {
        active.classList.remove('category--selected');
    }
    target.classList.add('category--selected');
}

// =============================
// FILTER LOGIC (멀티 태그 지원)
// =============================

function filterProjects(filter, projects, container) {

    // Work 영역만 애니메이션 적용
    if (container) {
        container.classList.add('animation-out');
        setTimeout(() => {
            container.classList.remove('animation-out');
        }, 250);
    }

    projects.forEach(project => {

        // data-type 예: "cloud analytics"
        const types = project.dataset.type.split(' ');

        if (filter === 'all' || types.includes(filter)) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }

    });
}