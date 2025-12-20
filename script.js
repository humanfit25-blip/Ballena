// Archivo principal de datos (puedes cambiarlo cada semana)
const WEEK_DATA_FILE = 'data/semana-29-dic-3-ene.json';

// Cargar datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch(WEEK_DATA_FILE);
        const data = await response.json();
        
        // Actualizar información del header
        document.querySelector('.box-name').textContent = data.boxName;
        document.querySelector('.subtitle-text').textContent = data.subtitle;
        document.querySelector('.week-dates-text').textContent = data.weekDates;
        
        // Generar las cards de los días
        const weekGrid = document.querySelector('.week-grid');
        weekGrid.innerHTML = ''; // Limpiar
        
        data.days.forEach((day, index) => {
            const dayCard = createDayCard(day, index);
            weekGrid.appendChild(dayCard);
        });
        
    } catch (error) {
        console.error('Error cargando datos:', error);
        document.querySelector('.week-grid').innerHTML = 
            '<div style="color: red; text-align: center; padding: 50px;">Error cargando planificación. Verifica que el archivo JSON existe.</div>';
    }
});

// Crear card de día
function createDayCard(day, index) {
    const card = document.createElement('div');
    card.className = 'day-card' + (day.isFestive ? ' festivo' : '');
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Header del día
    const header = document.createElement('div');
    header.className = 'day-header' + (day.isFestive ? ' festivo' : '');
    header.innerHTML = `
        <div class="day-name">${day.name}</div>
        <div class="day-date">${formatDate(day.date)}</div>
        ${day.festiveBadge ? `<div class="festivo-badge">${day.festiveBadge}</div>` : ''}
    `;
    card.appendChild(header);
    
    // Secciones del día
    day.sections.forEach(section => {
        const sectionDiv = createSection(section);
        card.appendChild(sectionDiv);
    });
    
    return card;
}

// Crear sección (haltero, crossfit, endurance)
function createSection(section) {
    const div = document.createElement('div');
    div.className = `program-section ${section.type}` + (section.isFestive ? ' festivo' : '');
    
    if (section.isFestive) {
        // Sección festiva
        div.innerHTML = `
            <div class="festivo-icon">${section.icon}</div>
            <div class="program-title">${section.title}</div>
            <div class="festivo-text">${section.content}</div>
        `;
    } else {
        // Sección normal
        let content = `<div class="program-title">${section.title}</div>`;
        content += '<div class="workout-content">';
        
        // Badges si existen
        if (section.badges) {
            section.badges.forEach(badge => {
                content += `<div class="${badge.type}-wod">${badge.text}</div>`;
            });
        }
        
        // Ejercicios (para halterofilia)
        if (section.exercises) {
            content += '<ul class="exercise-list">';
            section.exercises.forEach(ex => {
                content += `<li>${ex}</li>`;
            });
            content += '</ul>';
        }
        
        // Workout con título y detalles
        if (section.workoutTitle) {
            content += `<div class="workout-title">${section.workoutTitle}</div>`;
        }
        
        if (section.workoutDetails) {
            content += '<div class="workout-details">';
            section.workoutDetails.forEach(detail => {
                content += detail + '<br>';
            });
            content += '</div>';
        }
        
        content += '</div>';
        div.innerHTML = content;
    }
    
    return div;
}

// Formatear fecha
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Filtros (si los añades después)
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterCards(filter);
            
            // Actualizar botón activo
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterCards(filter) {
    const cards = document.querySelectorAll('.day-card');
    cards.forEach(card => {
        if (filter === 'all') {
            card.classList.remove('hidden');
        } else if (filter === 'festivo') {
            if (card.classList.contains('festivo')) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        } else {
            // Filtrar por tipo de sección
            const hasSection = card.querySelector(`.program-section.${filter}:not(.festivo)`);
            if (hasSection) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}
