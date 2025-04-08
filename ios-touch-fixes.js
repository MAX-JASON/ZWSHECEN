// iPad 专用触摸优化
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为 iPad
    const isIPad = /iPad/.test(navigator.userAgent) || 
                  (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
    
    if (!isIPad) return;

    console.log(' 应用 iPad 专用触摸优化 ');

    // 为所有按钮添加触摸反馈
    document.querySelectorAll('button, a, [role="button"]').forEach(btn => {
        // 确保最小触摸区域为 44x44px
        btn.style.minWidth = '44px';
        btn.style.minHeight = '44px';
        btn.style.padding = '12px 16px';
        
        // 添加触摸反馈效果
        btn.addEventListener('touchstart', function() {
            this.classList.add('ios-active');
        });
        
        btn.addEventListener('touchend', function() {
            this.classList.remove('ios-active');
        });
    });

    // 为表单元素增加触摸区域
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.style.minHeight = '44px';
        input.style.padding = '12px';
    });

    // 防止双击缩放
    let lastTouchTime = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchTime <= 300) {
            event.preventDefault();
        }
        lastTouchTime = now;
    }, { passive: false });

    // 改善滚动体验
    document.querySelectorAll('.scrollable').forEach(el => {
        el.style.webkitOverflowScrolling = 'touch';
    });

    // 修复点击延迟
    document.addEventListener('touchstart', function() {}, { passive: true });

    // 方向变化处理
    function handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        document.body.classList.toggle('ios-landscape', isLandscape);
        document.body.classList.toggle('ios-portrait', !isLandscape);
        
        // 调整布局
        adjustLayoutForOrientation(isLandscape);
    }

    // 初始方向检查
    handleOrientationChange();
    
    // 监听方向变化
    window.addEventListener('resize', function() {
        setTimeout(handleOrientationChange, 300);
    });

    // 布局调整函数
    function adjustLayoutForOrientation(isLandscape) {
        const container = document.querySelector('.dashboard-container');
        const advancedCards = document.querySelectorAll('.tech-card-advanced');
        
        if (container) {
            if (isLandscape) {
                container.style.padding = '20px';
                container.style.gridGap = '20px';
            } else {
                container.style.padding = '15px';
                container.style.gridGap = '15px';
            }
        }

        // 高级分析选项处理
        advancedCards.forEach(card => {
            card.style.display = 'block'; // 确保始终显示
            if (isLandscape) {
                card.style.width = 'calc(50% - 20px)';
                card.style.margin = '0 auto 20px';
            } else {
                card.style.width = '100%';
                card.style.margin = '0 0 20px';
            }
        });
    }

    // 确保高级分析选项可见
    document.querySelectorAll('.tech-card-advanced').forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transition = 'opacity 0.3s ease';
    });
});

// 添加 CSS 类用于触摸反馈和 iPad 优化
const style = document.createElement('style');
style.textContent = `
.ios-active {
    transform: scale(0.96);
    opacity: 0.9;
    transition: transform 0.1s ease, opacity 0.1s ease;
}

.ios-landscape .dashboard-grid {
    grid-template-columns: repeat(2, 1fr) !important;
}

.ios-portrait .dashboard-grid {
    grid-template-columns: 1fr !important;
}

/* 高级分析选项优化 */
.tech-card-advanced {
    display: block !important;
    opacity: 1 !important;
    transition: all 0.3s ease;
}

@media (max-width: 1024px) {
    body {
        -webkit-text-size-adjust: 100%;
    }
    
    .panel {
        padding: 20px !important;
        margin-bottom: 20px !important;
    }
    
    .btn-tech {
        padding: 16px 24px !important;
        font-size: 18px !important;
    }
    
    /* 高级分析选项在 iPad 上的样式 */
    .tech-card-advanced {
        padding: 20px !important;
        margin: 20px 0 !important;
        width: 100% !important;
    }
    
    .ios-landscape .tech-card-advanced {
        width: calc(50% - 20px) !important;
        margin: 0 auto 20px !important;
    }
}
`;
document.head.appendChild(style);
