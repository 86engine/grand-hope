// 原生手风琴，替代 Bootstrap collapse
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.accordion-button').forEach(function (button) {
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('data-bs-target');
      const collapse = document.querySelector(targetId);
      if (!collapse) return;

      const isOpen = collapse.classList.contains('show');

      // 关闭同组所有手风琴（如果 data-bs-parent 存在）
      const parentId = collapse.getAttribute('data-bs-parent');
      if (parentId) {
        const parent = document.querySelector(parentId);
        if (parent) {
          parent.querySelectorAll('.accordion-collapse.show').forEach(function (item) {
            if (item !== collapse) {
              item.classList.remove('show');
              const btn = parent.querySelector('[data-bs-target="#' + item.id + '"]');
              if (btn) {
                btn.classList.add('collapsed');
                btn.setAttribute('aria-expanded', 'false');
              }
            }
          });
        }
      }

      // 切换当前项
      collapse.classList.toggle('show', !isOpen);
      this.classList.toggle('collapsed', isOpen);
      this.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
});

// 原生 Bootstrap Tab 切换
document.querySelectorAll('[data-bs-toggle="pill"]').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute('data-bs-target'));
    if (!target) return;

    var tabContent = target.parentElement;
    tabContent.querySelectorAll('.tab-pane').forEach(function(pane) {
      pane.classList.remove('show', 'active');
    });

    var tabNav = this.closest('.nav');
    if (tabNav) {
      tabNav.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.remove('active');
        link.setAttribute('aria-selected', 'false');
      });
    }

    target.classList.add('show', 'active');
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');
  });
});