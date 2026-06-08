'use strict';

function initTimeline() {
  const container = document.getElementById('timeline-list');

  const html = YATSUGATAKE_GEOLOGY.events.map((ev, i) => {
    const isLast = i === YATSUGATAKE_GEOLOGY.events.length - 1;
    const dotColor = i === 0 ? '#8e44ad' :
                     i < 3   ? '#e67e22' :
                     i < 5   ? '#c0392b' : '#7c9ef5';
    return `
      <div class="tl-item ${isLast ? 'tl-last' : ''}">
        <div class="tl-line-col">
          <div class="tl-dot" style="background:${dotColor}"></div>
          ${isLast ? '' : '<div class="tl-line"></div>'}
        </div>
        <div class="tl-body">
          <div class="tl-year">${ev.year}</div>
          <div class="tl-title">${ev.title}</div>
          <div class="tl-desc">${ev.desc}</div>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = html;
}
