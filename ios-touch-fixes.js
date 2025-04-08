/**
 * iOS Touch Fixes - 專門用於修復iOS設備上的觸控和滾動問題
 * 版本: 1.0.0
 */

(function() {
    'use strict';
    
    // 設備檢測
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    const isIPad = /iPad/.test(navigator.userAgent) || 
                  (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
                  
    if (!isIOS) return; // 只在iOS設備上執行
    
    console.log('iOS Touch Fixes 已啟動');
    document.documentElement.classList.add('ios-device');
    if (isIPad) document.documentElement.classList.add('ipad-device');
    
    // 修復iOS橡皮筋效果
    function fixIOSOverscroll() {
        // 防止body過度滾動
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.closest('.allow-scroll')) return; // 允許特定元素滾動
            if (e.touches.length > 1) return; // 允許多點觸控
            e.preventDefault();
        }, { passive: false });
        
        // 允許滾動容器內部滾動，但阻止到達邊界時的過度滾動
        document.querySelectorAll('.allow-scroll').forEach(element => {
            element.addEventListener('touchstart', function(e) {
                // 記錄初始滾動位置
                this._scrollTop = this.scrollTop;
                this._scrollLeft = this.scrollLeft;
                this._scrollHeight = this.scrollHeight;
                this._scrollWidth = this.scrollWidth;
                this._clientHeight = this.clientHeight;
                this._clientWidth = this.clientWidth;
            });
            
            element.addEventListener('touchmove', function(e) {
                // 檢查是否到達邊界
                const scrollUp = e.touches[0].clientY > (e.target._touchY || 0);
                const scrollDown = !scrollUp;
                const scrollLeft = e.touches[0].clientX > (e.target._touchX || 0);
                const scrollRight = !scrollLeft;
                
                // 記錄觸摸位置用於確定方向
                e.target._touchY = e.touches[0].clientY;
                e.target._touchX = e.touches[0].clientX;
                
                // 如果到達邊界且試圖繼續滾動則阻止默認行為
                if ((this.scrollTop <= 0 && scrollUp) || 
                    (this.scrollTop + this._clientHeight >= this._scrollHeight && scrollDown)) {
                    e.preventDefault();
                }
                
                if ((this.scrollLeft <= 0 && scrollLeft) || 
                    (this.scrollLeft + this._clientWidth >= this._scrollWidth && scrollRight)) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }
    
    // 修復iOS點擊延遲300ms問題
    function fixIOSTapDelay() {
        // 基本修復 - 通過CSS實現
        document.head.insertAdjacentHTML('beforeend', 
            '<style>' +
            '* { -webkit-touch-callout: none; }' +
            'a, button, .clickable, [role="button"] { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }' +
            '</style>'
        );
        
        // 對於需要特殊處理的元素添加事件監聽
        const needsFix = document.querySelectorAll('a, button, .clickable, [role="button"], .nav-link, .btn');
        
        needsFix.forEach(el => {
            el.addEventListener('touchstart', function(e) {
                // 標記為觸摸事件
                this._touchStarted = true;
                
                // 移除任何當前按下狀態
                this.classList.remove('ios-active');
                
                // 延遲添加以避免閃爍
                setTimeout(() => {
                    if (this._touchStarted) {
                        this.classList.add('ios-active');
                    }
                }, 10);
            }, { passive: true });
            
            el.addEventListener('touchend', function(e) {
                // 清除標記
                this._touchStarted = false;
                
                // 移除按下狀態
                setTimeout(() => {
                    this.classList.remove('ios-active');
                }, 100);
            }, { passive: true });
            
            // 觸摸取消時移除狀態
            el.addEventListener('touchcancel', function(e) {
                this._touchStarted = false;
                this.classList.remove('ios-active');
            }, { passive: true });
        });
    }
    
    // 修復頁籤切換問題
    function fixIOSTabSwitching() {
        // 確保我們只處理一次
        if (window._iosTabFixApplied) return;
        window._iosTabFixApplied = true;
        
        // 選擇所有頁籤元素
        const tabLinks = document.querySelectorAll('.nav-tabs .nav-link, .nav-pills .nav-link');
        
        tabLinks.forEach(link => {
            // 移除由框架添加的事件監聽器
            const oldLink = link.cloneNode(true);
            link.parentNode.replaceChild(oldLink, link);
            const newLink = oldLink;
            
            // 添加新的事件監聽器
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // 獲取頁籤目標
                const targetSelector = this.getAttribute('data-bs-target') || 
                                      this.getAttribute('href');
                const targetTab = document.querySelector(targetSelector);
                
                // 如果無法找到目標或該頁籤已被禁用則不處理
                if (!targetTab || this.hasAttribute('disabled') || 
                    this.classList.contains('disabled')) {
                    return false;
                }
                
                // 手動處理頁籤切換
                // 1. 取消激活其他頁籤
                tabLinks.forEach(tab => {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                    
                    // 也隱藏對應內容
                    const tabTargetSelector = tab.getAttribute('data-bs-target') || 
                                            tab.getAttribute('href');
                    const tabTarget = document.querySelector(tabTargetSelector);
                    if (tabTarget) {
                        tabTarget.classList.remove('show', 'active');
                    }
                });
                
                // 2. 激活當前頁籤
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // 3. 顯示目標內容
                targetTab.classList.add('show', 'active');
                
                // 4. 重置滾動位置
                setTimeout(() => {
                    targetTab.scrollTop = 0;
                }, 0);
                
                // 5. 觸發進度更新
                const tabId = targetSelector.replace('#', '');
                if (typeof updateProgressBar === 'function') {
                    updateProgressBar(tabId);
                }
                
                // 6. 觸發頁籤切換自定義事件
                const tabEvent = new CustomEvent('tab-switched', {
                    detail: {
                        tabId: tabId,
                        tabElement: this,
                        tabContent: targetTab
                    }
                });
                document.dispatchEvent(tabEvent);
                
                return false;
            });
        });
    }
    
    // iOS設備旋轉處理
    function handleIOSOrientationChange() {
        // 檢測方向變化
        window.addEventListener('orientationchange', function() {
            console.log('iOS方向變化:', window.orientation);
            
            // 添加過渡類
            document.body.classList.add('ios-orientation-changing');
            
            // 使用遮罩隱藏過渡效果
            const orientationMask = document.createElement('div');
            orientationMask.className = 'orientation-transition-mask';
            orientationMask.style.position = 'fixed';
            orientationMask.style.top = '0';
            orientationMask.style.left = '0';
            orientationMask.style.width = '100%';
            orientationMask.style.height = '100%';
            orientationMask.style.backgroundColor = '#040b19';
            orientationMask.style.zIndex = '9999';
            orientationMask.style.opacity = '0';
            orientationMask.style.transition = 'opacity 0.2s ease-in';
            document.body.appendChild(orientationMask);
            
            // 淡入遮罩
            setTimeout(() => {
                orientationMask.style.opacity = '1';
            }, 10);
            
            // 處理方向變化完成後的操作
            setTimeout(() => {
                // 重新計算布局
                updateLayout();
                
                // 修復頁籤問題
                fixActiveTab();
                
                // 重新定位滾動位置
                resetScrollPositions();
                
                // 淡出遮罩並移除
                orientationMask.style.opacity = '0';
                setTimeout(() => {
                    orientationMask.remove();
                    document.body.classList.remove('ios-orientation-changing');
                    document.body.classList.add('ios-orientation-changed');
                    
                    // 在動畫完成後重新渲染圖表
                    setTimeout(() => {
                        redrawCharts();
                        document.body.classList.remove('ios-orientation-changed');
                    }, 300);
                }, 250);
            }, 300);
        });
    }
    
    // 更新布局
    function updateLayout() {
        const isLandscape = window.innerWidth > window.innerHeight;
        
        // 更新方向類
        document.body.classList.toggle('ios-landscape', isLandscape);
        document.body.classList.toggle('ios-portrait', !isLandscape);
        
        // 觸發布局更新事件
        window.dispatchEvent(new CustomEvent('ios-layout-update', {
            detail: { isLandscape }
        }));
    }
    
    // 修復活動頁籤
    function fixActiveTab() {
        const activeTabLink = document.querySelector('.nav-link.active');
        if (activeTabLink) {
            // 保存ID
            const tabId = activeTabLink.getAttribute('data-bs-target') || 
                         activeTabLink.getAttribute('href');
            
            // 重新激活頁籤
            setTimeout(() => {
                activeTabLink.click();
            }, 50);
        }
    }
    
    // 重置滾動位置
    function resetScrollPositions() {
        // 重置主容器
        const mainContainer = document.querySelector('.dashboard-container');
        if (mainContainer) {
            mainContainer.scrollTop = 0;
        }
        
        // 重置活動面板
        const activePane = document.querySelector('.tab-pane.active');
        if (activePane) {
            activePane.scrollTop = 0;
        }
        
        // 重置所有滾動容器
        document.querySelectorAll('.allow-scroll').forEach(el => {
            el.scrollTop = 0;
        });
    }
    
    // 重繪圖表
    function redrawCharts() {
        if (window.Chart && window.Chart.instances) {
            Object.values(window.Chart.instances).forEach(chart => {
                try {
                    chart.resize();
                } catch (e) {
                    console.warn('重繪圖表時發生錯誤:', e);
                }
            });
        } else if (window.irrChartInstance) {
            // 如果使用全局變量存儲圖表實例
            const chartInstances = [
                'irrChartInstance', 
                'dividendChartInstance', 
                'cumulativeDividendChartInstance',
                'medicalChartInstance',
                'radarChartInstance', 
                'reportChartInstance',
                'overallChartInstance'
            ];
            
            chartInstances.forEach(instanceName => {
                if (window[instanceName]) {
                    try {
                        window[instanceName].resize();
                    } catch (e) {
                        console.warn(`重繪${instanceName}時發生錯誤:`, e);
                    }
                }
            });
        }
    }
    
    // 設置iOS專用樣式
    function addIOSStyles() {
        const iosStyles = `
        .ios-device {
            -webkit-overflow-scrolling: touch;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        
        .ios-active {
            opacity: 0.7;
            transform: scale(0.97);
            transition: all 0.1s ease;
        }
        
        /* 增大觸控目標 */
        .ios-device button,
        .ios-device .btn,
        .ios-device .nav-link,
        .ios-device input,
        .ios-device select,
        .ios-device .form-control,
        .ios-device .form-select {
            min-height: 44px;
        }
        
        .ios-device .tab-content {
            position: relative;
            height: auto;
            min-height: 60vh;
            overflow: hidden;
        }
        
        .ios-device .tab-pane {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease;
            padding-bottom: 50px;
            transform: translate3d(0,0,0);
        }
        
        .ios-device .tab-pane.active {
            opacity: 1;
            visibility: visible;
            position: relative;
            z-index: 2;
        }
        
        /* 防止捲軸影響點擊 */
        .ios-device .tab-pane::-webkit-scrollbar {
            width: 5px;
            background: transparent;
        }
        
        .ios-device .tab-pane::-webkit-scrollbar-thumb {
            background: rgba(0, 229, 255, 0.5);
            border-radius: 2.5px;
        }
        
        /* 方向變化動畫 */
        .ios-orientation-changing {
            transition: none !important;
        }
        
        .ios-orientation-changed {
            animation: ios-orientation-flash 0.5s ease-out;
        }
        
        @keyframes ios-orientation-flash {
            0% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        
        /* iPad特殊樣式 */
        @media (min-width: 768px) {
            .ipad-device .tab-content {
                min-height: 70vh;
            }
        }
        `;
        
        const styleEl = document.createElement('style');
        styleEl.textContent = iosStyles;
        document.head.appendChild(styleEl);
    }
    
    // 防止鍵盤彈出導致布局問題
    function fixIOSKeyboard() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                document.body.classList.add('ios-keyboard-open');
            });
            
            input.addEventListener('blur', function() {
                document.body.classList.remove('ios-keyboard-open');
            });
        });
    }
    
    // 處理iOS Home鍵手勢導致的頁面縮小問題
    function handleIOSHomeGesture() {
        // 在iOS 13+上，下滑手勢可能會導致頁面縮小
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length !== 1) return;
            
            const touch = e.touches[0];
            const windowHeight = window.innerHeight;
            
            // 如果觸摸點在頁面底部並且向上滑動，可能是嘗試使用Home手勢
            if (touch.clientY > windowHeight - 20 && e._swipeDirection === 'up') {
                e.preventDefault();
            }
            
            // 記錄滑動方向
            if (e._lastY === undefined) {
                e._lastY = touch.clientY;
                return;
            }
            
            e._swipeDirection = touch.clientY < e._lastY ? 'up' : 'down';
            e._lastY = touch.clientY;
        }, { passive: false });
    }
    
    // 監聽DOM載入
    document.addEventListener('DOMContentLoaded', function() {
        // 添加iOS專用樣式
        addIOSStyles();
        
        // 施加修復
        setTimeout(() => {
            fixIOSOverscroll();
            fixIOSTapDelay();
            fixIOSTabSwitching();
            fixIOSKeyboard();
            handleIOSHomeGesture();
            handleIOSOrientationChange();
            
            // 初始化布局
            updateLayout();
            
            console.log('iOS觸控修復完成');
        }, 100);
    });
    
    // 公開API
    window.iOSTouchFixes = {
        reapply: function() {
            fixIOSTabSwitching();
            updateLayout();
        },
        isIOS: isIOS,
        isIPad: isIPad
    };
})();
