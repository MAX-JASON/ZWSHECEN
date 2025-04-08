/**
 * iOS Touch Fixes - 專門用於修復iOS設備上的觸控和滾動問題
 * 版本: 2.0.0 - iPad優化版本
 */

(function() {
    'use strict';
    
    // 設備檢測 - 優化版本確保能識別新款iPad
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    const isIPad = /iPad/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                  
    if (!isIOS) return; // 只在iOS設備上執行
    
    console.log('iOS Touch Fixes 2.0 啟動中 - iPad優化版本');
    document.documentElement.classList.add('ios-device');
    if (isIPad) document.documentElement.classList.add('ipad-device');
    
    // 強化版 - 修復iOS滾動和觸控問題
    function fixIOSOverscroll() {
        console.log('正在優化iPad滾動體驗...');
        
        // 檢查並開啟所有可滾動容器的觸控滾動功能
        const scrollContainers = document.querySelectorAll('.single-tab-content, .tab-pane, .dashboard-container, .tab-content');
        console.log('找到 ' + scrollContainers.length + ' 個可滾動容器');
        
        scrollContainers.forEach(container => {
            // 啟用慣性滾動
            container.style.WebkitOverflowScrolling = 'touch';
            container.style.overflowY = 'auto';
            container.style.overflowX = 'hidden';
            
            // 防止橡皮筋效果，但允許正常滾動
            container.addEventListener('touchmove', function(e) {
                const scrollTop = this.scrollTop;
                const scrollHeight = this.scrollHeight;
                const height = this.clientHeight;
                
                if ((scrollTop <= 0 && e.touches[0].pageY > e.touches[0].screenY) ||
                    (scrollTop + height >= scrollHeight && e.touches[0].pageY < e.touches[0].screenY)) {
                    // 防止過度滾動
                    e.preventDefault();
                }
            }, { passive: false });
        });
        
        // 阻止整體頁面滾動，只允許內部容器滾動
        document.addEventListener('touchmove', function(e) {
            // 檢查是否在滾動容器內
            if (e.target.closest('.single-tab-content, .tab-pane, .dashboard-container, [class*="scroll"], form, .form-control')) {
                return; // 允許容器內滾動
            }
            
            // 阻止整頁滾動
            if (e.touches.length === 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 解決iOS頁面過度滾動問題
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflowY = 'hidden';
        
        const container = document.querySelector('.dashboard-container');
        if (container) {
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.right = '0';
            container.style.bottom = '0';
            container.style.overflowY = 'auto';
            container.style.WebkitOverflowScrolling = 'touch';
            container.style.paddingBottom = '40px';
        }
    }

    // 完全修復頁籤切換問題 - 增強版
    function fixIOSTabSwitching() {
        console.log('正在修復iPad頁籤切換功能...');
        // 確保只執行一次
        if (window._iosTabFixApplied) return;
        window._iosTabFixApplied = true;
        
        // 選擇所有頁籤元素
        const tabLinks = document.querySelectorAll('.nav-tabs .nav-link, .nav-pills .nav-link');
        console.log('找到 ' + tabLinks.length + ' 個頁籤');
        
        // 完全移除原有的點擊事件，確保不會有事件冒泡問題
        tabLinks.forEach(link => {
            const clone = link.cloneNode(true);
            link.parentNode.replaceChild(clone, link);
            
            // 為新元素添加自定義點擊處理
            clone.addEventListener('click', handleTabClick);
            
            // 同時處理觸摸事件，確保在iOS上工作正常
            clone.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                setTimeout(() => {
                    handleTabClick.call(this, e);
                }, 10);
            }, { passive: false });
        });
        
        function handleTabClick(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 檢查是否已禁用
            if (this.hasAttribute('disabled') || this.classList.contains('disabled')) {
                return false;
            }
            
            // 獲取目標頁籤
            const targetId = this.getAttribute('data-bs-target') || this.getAttribute('href');
            if (!targetId) return false;
            
            const targetPane = document.querySelector(targetId);
            if (!targetPane) return false;
            
            console.log('切換到頁籤: ' + targetId);
            
            // 更新頁籤狀態
            document.querySelectorAll('.nav-tabs .nav-link, .nav-pills .nav-link').forEach(tab => {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // 更新頁籤內容
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            targetPane.classList.add('show', 'active');
            
            // 重置滾動位置
            setTimeout(() => {
                targetPane.scrollTop = 0;
                const container = document.querySelector('.dashboard-container');
                if (container) container.scrollTop = 0;
                
                // 更新進度條 - 如果存在進度條函數
                const tabId = targetId.replace('#', '');
                if (typeof window.updateProgressBar === 'function') {
                    window.updateProgressBar(tabId);
                }
            }, 50);
            
            return false;
        }
    }
    
    // 完全重置和修復點擊事件
    function fixIOSTapDelay() {
        // 添加必要的CSS來禁用延遲
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .ios-device * {
                    -webkit-touch-callout: none;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                }
                
                .ios-device button,
                .ios-device .btn,
                .ios-device a,
                .ios-device .nav-link,
                .ios-device [role="button"] {
                    min-height: 44px; /* Apple推薦的最小觸控區域 */
                    cursor: pointer;
                    user-select: none;
                }
                
                /* 視覺回饋 */
                .ios-active {
                    transform: scale(0.97);
                    opacity: 0.8;
                    transition: transform 0.1s ease, opacity 0.1s ease;
                }
            </style>
        `);
        
        // 修復交互元素的點擊延遲
        const interactiveEls = document.querySelectorAll(
            'button, .btn, a, .nav-link, [role="button"], .form-check-label, .clickable'
        );
        
        interactiveEls.forEach(el => {
            // 避免重複綁定
            if (el._tapFixed) return;
            el._tapFixed = true;
            
            // 移除舊的事件綁定
            const clone = el.cloneNode(true);
            el.parentNode.replaceChild(clone, el);
            const newEl = clone;
            
            // 添加視覺回饋
            newEl.addEventListener('touchstart', function(e) {
                this.classList.add('ios-active');
            }, { passive: true });
            
            newEl.addEventListener('touchend', function(e) {
                this.classList.remove('ios-active');
                
                // 對於特定元素，如果是頁籤，讓點擊處理延遲一下，等待視覺回饋
                if (this.classList.contains('nav-link')) {
                    setTimeout(() => {
                        if (typeof this.click === 'function') {
                            this.click();
                        }
                    }, 50);
                }
            }, { passive: true });
            
            newEl.addEventListener('touchcancel', function() {
                this.classList.remove('ios-active');
            }, { passive: true });
        });
    }
    
    // 完全修復方向變化處理
    function handleOrientationChange() {
        // 監聽方向變化
        window.addEventListener('orientationchange', function() {
            console.log('設備方向變化: ' + window.orientation);
            
            // 添加轉場效果，防止閃爍
            document.body.classList.add('orientation-changing');
            
            // 延遲處理方向變化
            setTimeout(() => {
                updateLayoutForOrientation();
                resetScrollPositions();
                
                // 延遲移除轉場效果
                setTimeout(() => {
                    document.body.classList.remove('orientation-changing');
                }, 300);
            }, 300);
        });
        
        // 初始化
        updateLayoutForOrientation();
    }
    
    // 根據方向更新布局
    function updateLayoutForOrientation() {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        // 切換方向類
        document.body.classList.toggle('ios-landscape', isLandscape);
        document.body.classList.toggle('ios-portrait', !isLandscape);
        
        // 更新主要容器布局
        const dashboardGrids = document.querySelectorAll('.dashboard-grid');
        
        dashboardGrids.forEach(grid => {
            if (isLandscape) {
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                grid.style.gridGap = '15px';
            } else {
                grid.style.display = 'grid';
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gridGap = '10px';
            }
        });
        
        // 更新圖表大小
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.style.height = isLandscape ? '380px' : '320px';
        });
        
        // 確保圖表重繪
        setTimeout(function() {
            if (window.Chart) {
                try {
                    const charts = Object.values(Chart.instances || {});
                    charts.forEach(chart => {
                        try { 
                            chart.resize();
                            chart.render(); 
                        } catch(e) { 
                            console.warn('無法重繪圖表:', e); 
                        }
                    });
                } catch(e) {
                    console.warn('圖表重繪失敗:', e);
                }
            }
        }, 500);
    }
    
    // 重置滾動位置
    function resetScrollPositions() {
        // 重置各種可滾動容器
        const scrollables = document.querySelectorAll('.single-tab-content, .tab-pane, .dashboard-container');
        scrollables.forEach(el => el.scrollTop = 0);
    }
    
    // 公共接口
    window.iOSTouchFixes = {
        version: '2.0.0',
        isIOS: isIOS,
        isIPad: isIPad,
        
        // 強制重新應用所有修復
        reapply: function() {
            fixIOSOverscroll();
            fixIOSTabSwitching();
            fixIOSTapDelay();
            handleOrientationChange();
            console.log('iOS Touch Fixes 已重新應用');
        },
        
        // 更新布局
        updateLayout: updateLayoutForOrientation,
        
        // 重置滾動位置
        resetScroll: resetScrollPositions
    };
    
    // 頁面加載完成後執行所有修復
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM已加載，正在應用iOS修復...');
        
        // 立即應用修復
        fixIOSOverscroll();
        fixIOSTapDelay();
        
        // 延遲應用更複雜的修復，確保DOM完全加載
        setTimeout(function() {
            fixIOSTabSwitching();
            handleOrientationChange();
            console.log('所有iOS修復已完成應用');
        }, 100);
    });
})();
