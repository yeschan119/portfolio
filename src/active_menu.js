const section_id_list = [
    '#home', '#about', '#skills', '#work', '#study', '#contact'
];

//id === selection_id_list인 item들 찾기
const sections = section_id_list.map(id => document.querySelector(id));
//href == selection_id_list와 같은 item들 찾기
const nav_items = section_id_list.map(id => document.querySelector(`[href="${id}"]`));

//화면에 보여지는 아이템의 리스트를 boolean으로 표시하기 위한 리스트
const visible_sections = section_id_list.map(() => false);

const options = {
    rootMargin: '-20% 0px 0px 0px',
    threshold: [0, 0.98],
};

const observer = new IntersectionObserver(callback, options);
sections.forEach((section) => observer.observe(section));

function callback(entries, options) {
    let select_last_one;
    entries.forEach((entry) => {
        const index = section_id_list.indexOf(`#${entry.target.id}`);
        
        visible_sections[index] = entry.isIntersecting;

        select_last_one =
            index === section_id_list.length - 1 &&
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.95;
    });

    const nav_index = select_last_one ? section_id_list.length - 2
                        : get_first_intersecting(visible_sections);
    
    show_selected_menu(nav_index);
}

function get_first_intersecting(intersections) {
    const index = intersections.indexOf(true);
    return index >= 0 ? index : 0;
}

let active_nav_item = nav_items[0]; //최초에 home이 active상태이므로..

function show_selected_menu (idx) {
    active_nav_item.classList.remove('active');
    nav_items[idx].classList.add('active');
    active_nav_item = nav_items[idx];
}