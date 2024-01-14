'use strict';

// project filtering 관련 로직
const work__categories = document.querySelector('.work__categories');
const work__projects = document.querySelectorAll('.work__project');
const projectsContainer = document.querySelector('.projects');
const study__categories = document.querySelector('.study__categories');
const study__projects = document.querySelectorAll('.study__project');

work__categories.addEventListener('click', (event)=>{
    const filter = event.target.dataset.category;
    if (filter == null) {
        return;
    }
    move_category_selection(event.target, '.work__category.category--selected');
    filter_selected_project(filter, work__projects, work__categories);   
});


study__categories.addEventListener('click', (event)=>{
    const filter = event.target.dataset.category;
    if (filter == null) {
        return;
    }
    move_category_selection(event.target, '.study__category.category--selected');
    filter_selected_project(filter, study__projects, study__categories);
});

function move_category_selection(target, category) {
    const active = document.querySelector(category);
    active.classList.remove('category--selected');
    target.classList.add('category--selected');
}

function filter_selected_project (filter, projects, categories) {
    if (categories.className === 'work__categories') {
        projectsContainer.classList.add('animation-out');
        setTimeout(()=> {
            projectsContainer.classList.remove('animation-out');
        }, 250);
    }

    projects.forEach((project) => {
        if (filter === 'all' || filter === project.dataset.type) {
            project.style.display = 'block';
        }
        else {
            project.style.display = 'none';
        }
    });
}