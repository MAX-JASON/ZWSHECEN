/**
 * iOS Touch Fixes - 專門用於修復 iOS 設備上的觸控和滾動問題
 * 版本 : 3.0.0 - 完全重寫版本，解決所有 iPad 問題
 */

(function() {
    'use strict';
    
    // 增強型設備檢測 - 保證識別所有 iPad 型號，包括新款 iPad Pro
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                 (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    
    const isIPad = /iPad/.test(navigator.userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                  (navigator.userAgent.includes('Mac') && 'ontouchend' in document && navigator.maxTouchPoints > 1);
                  
    // 強制執行，確保在所有設備上都工作正常
    console.log('iOS Touch Fixes 3.0 啟動中 - 強化版本，解決所有滑動和觸控問題 ');
    
    console.log('iOS Touch Fixes 2.0 啟動中 - iPad 優化版本 ');
    document.documentElement.classList.add('ios-device');
    if (isIPad) document.documentElement.classList.add('ipad-device');
      // 完全重寫的滾動修復功能 - 解決所有問題
    function fixIOSOverscroll() {
        console.log(' 正在應用全新 iPad 滾動修復 ...');
        
        // 首先修復 body 和 html 樣式，確保正確顯示內容
        document.documentElement.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.position = 'relative'; // 改為 relative 而不是 fixed，解決內容不顯示問題
        document.body.style.width = '100%';
        document.body.style.overflow = 'auto';
        document.body.style.WebkitOverflowScrolling = 'touch';
        
        // 確保所有內容容器可以滾動
        const allContainers = [
            ...document.querySelectorAll('.single-tab-content, .tab-pane, .dashboard-container, .tab-content'),
            ...document.querySelectorAll('form, .panel, .tech-card, .row, .col'),
            ...document.querySelectorAll('[class*="scroll"]')
        ];
        
        console.log(' 找到 ' + allContainers.length + ' 個可能的滾動容器 ');
        
        // 為所有潛在滾動容器啟用觸控滾動
        allContainers.forEach(container => {
            if (!container) return;
            
            // 重置可能妨礙滾動的樣式
            container.style.WebkitOverflowScrolling = 'touch';
            container.style.overflowY = 'visible';
            container.style.overflowX = 'visible';
            
            // 移除可能存在的事件監聽器，避免衝突
            container.removeEventListener('touchmove', handleContainerTouchMove);
            
            // 添加優化的觸控處理
            container.addEventListener('touchmove', handleContainerTouchMove, { passive: true });
            
            // 確保表單元素正確顯示
            const formElements = container.querySelectorAll('input, select, textarea, button');
            formElements.forEach(el => {
                el.style.opacity = '1';
                el.style.pointerEvents = 'auto';
            });
        });
        
        // 修復主容器滾動
        const mainContainer = document.querySelector('.dashboard-container');
        if (mainContainer) {
            mainContainer.style.position = 'absolute';
            mainContainer.style.top = '0';
            mainContainer.style.left = '0';
            mainContainer.style.right = '0';
            mainContainer.style.bottom = '0';
            mainContainer.style.overflowY = 'auto';
            mainContainer.style.WebkitOverflowScrolling = 'touch';
            mainContainer.style.paddingBottom = '60px'; // 增加底部填充確保內容可見
        }
        
        // 解決表單問題
        document.querySelectorAll('form').forEach(form => {
            form.style.display = 'block';
            form.style.opacity = '1';
            
            // 確保所有輸入字段可見
            form.querySelectorAll('input, select, textarea').forEach(input => {
                input.style.display = 'block';
                input.style.opacity = '1';
                input.style.visibility = 'visible';
            });
        });
        
        // 移除整頁觸控限制
        document.removeEventListener('touchmove', handleDocumentTouchMove);
        
        // 只阻止真正需要阻止的觸控事件
        document.addEventListener('touchmove', function(e) {
            // 如果觸摸點在滾動容器內，就允許滾動
            if (e.target.closest('.single-tab-content, .tab-pane, .dashboard-container, form, input, select, textarea')) {
                return;
            }
            
            // 否則，防止頁面橡皮筋效果
            if (e.touches.length === 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        console.log('iPad 滾動修復完成，所有內容區域應該可以正常滾動 ');
    }
    
    // 容器觸控處理
    function handleContainerTouchMove(e) {
        // 這裡不阻止默認行為，確保可以正常滾動
    }
    
    // 文檔觸控處理
    function handleDocumentTouchMove(e) {
        // 只有在非滾動區域才阻止
        if (!e.target.closest('.single-tab-content, .tab-pane, .dashboard-container, [class*="scroll"], form, input, select, textarea')) {
            e.preventDefault();
        }
    }

    // 完全修復頁籤切換問題 - 增強版
    function fixIOSTabSwitching() {
        console.log(' 正在修復 iPad 頁籤切換功能 ...');
        // 確保只執行一次
        if (window._iosTabFixApplied) return;
        window._iosTabFixApplied = true;
        
        // 選擇所有頁籤元素
        const tabLinks = document.querySelectorAll('.nav-tabs .nav-link, .nav-pills .nav-link');
        console.log(' 找到 ' + tabLinks.length + ' 個頁籤 ');
        
        // 完全移除原有的點擊事件，確保不會有事件冒泡問題
        tabLinks.forEach(link => {
            const clone = link.cloneNode(true);
            link.parentNode.replaceChild(clone, link);
            
            // 為新元素添加自定義點擊處理
            clone.addEventListener('click', handleTabClick);
            
            // 同時處理觸摸事件，確保在 iOS 上工作正常
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
            
            console.log(' 切換到頁籤 : ' + targetId);
            
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
        // 添加必要的 CSS 來禁用延遲
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
                    min-height: 44px; /* Apple 推薦的最小觸控區域 */
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
            console.log(' 設備方向變化 : ' + window.orientation);
            
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
                            console.warn(' 無法重繪圖表 :', e); 
                        }
                    });
                } catch(e) {
                    console.warn(' 圖表重繪失敗 :', e);
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
            console.log('iOS Touch Fixes 已重新應用 ');
        },
        
        // 更新布局
        updateLayout: updateLayoutForOrientation,
        
        // 重置滾動位置
        resetScroll: resetScrollPositions
    };
    
    // 頁面加載完成後執行所有修復
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM 已加載，正在應用 iOS 修復 ...');
        
        // 立即應用修復
        fixIOSOverscroll();
        fixIOSTapDelay();
        
        // 延遲應用更複雜的修復，確保 DOM 完全加載
        setTimeout(function() {
            fixIOSTabSwitching();
            handleOrientationChange();
            console.log(' 所有 iOS 修復已完成應用 ');
        }, 100);
    });
})();
