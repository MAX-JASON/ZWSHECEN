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
    
    // 修復iOS橡皮筋效果並允許正常滑動
    function fixIOSOverscroll() {
        // 只阻止頁面級別的橡皮筋效果，允許容器內部正常滑動
        document.addEventListener('touchmove', function(e) {
            // 檢查是否為滾動容器
            if (e.target.closest('.single-tab-content, .tab-pane, .dashboard-container, [class*="scroll"]')) {
                return; // 允許這些元素內部滑動
            }
            
            // 只阻止頁面級別的過度滾動
            if (e.touches.length === 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 為所有滾動容器啟用觸控滑動
        document.querySelectorAll('.single-tab-content, .tab-pane, .dashboard-container').forEach(element => {
            // 移除可能已存在的事件監聽器
            element.removeEventListener('touchmove', handleTouchMove);
            
            // 添加新的事件監聽器
            element.addEventListener('touchmove', handleTouchMove, { passive: true });
        });
    }

    // 處理觸摸滑動事件
    function handleTouchMove(e) {
        // 不阻止默認行為，允許自然滑動
        // 只在特殊情況下處理底部檢測
        const container = this;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const height = container.clientHeight;
        
        // 僅在接近底部時檢查是否需要跳轉
        if (scrollTop + height >= scrollHeight - 10) {
            // 可能需要跳轉，但不阻止滑動
            setTimeout(() => {
                if (scrollTop + height >= scrollHeight - 5) {
                    jumpToNextPage();
                }
            }, 100);
        }
    }

    // 跳轉到下一頁的功能
    function jumpToNextPage() {
        const activeTab = document.querySelector('.nav-link.active');
        if (activeTab) {
            const nextTab = activeTab.parentElement.nextElementSibling?.querySelector('.nav-link');
            if (nextTab && !nextTab.hasAttribute('disabled')) {
                nextTab.click();
            }
        }
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
                
                // 標記正在進行頁籤切換
                window._isTabSwitching = true;
                
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
                
                // 4. 重置滾動位置 - 使用更可靠的方式
                setTimeout(() => {
                    // 直接回到頂部而不使用scrollTo (避免兼容性問題)
                    targetTab.scrollTop = 0;
                    // 同時也確保容器滾動到頂部
                    const container = document.querySelector('.dashboard-container');
                    if (container) {
                        container.scrollTop = 0;
                    }
                }, 50);
                
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
        // 監聽方向變化事件
        window.addEventListener('orientationchange', function() {
            console.log('iOS方向變化:', window.orientation);
            
            // 添加過渡類
            document.body.classList.add('ios-orientation-changing');
            
            // 創建全屏遮罩，防止布局閃爍
            const mask = document.createElement('div');
            mask.className = 'orientation-mask';
            mask.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #040b19;
                z-index: 9999;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(mask);
            
            // 延遲處理以確保方向實際改變
            setTimeout(() => {
                // 強制重新計算布局 - 多次調用以確保生效
                updateLayout();
                
                // 等待布局穩定
                setTimeout(() => {
                    // 二次更新以確保生效
                    updateLayout();
                    
                    // 修復頁籤並重置滾動位置
                    fixActiveTab();
                    resetScrollPositions();
                    
                    // 等待布局完成後重繪圖表
                    setTimeout(() => {
                        redrawCharts();
                        
                        // 完成後淡出並移除遮罩
                        mask.style.opacity = '0';
                        setTimeout(() => {
                            mask.remove();
                            document.body.classList.remove('ios-orientation-changing');
                        }, 300);
                        
                    }, 200);
                }, 300);
            }, 300);
        });
        
        // 同時監聽resize事件，作為備用
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', function() {
            // 只在寬度變化顯著時觸發（避免鍵盤彈出等情況）
            if (Math.abs(window.innerWidth - lastWidth) > 100) {
                console.log('顯著寬度變化:', lastWidth, '->', window.innerWidth);
                lastWidth = window.innerWidth;
                
                // 延遲處理以避免過於頻繁
                clearTimeout(window._resizeTimer);
                window._resizeTimer = setTimeout(() => {
                    updateLayout();
                    setTimeout(redrawCharts, 100);
                }, 200);
            }
        });
        
        // 初始化布局
        updateLayout();
    }
    
    // 更新布局
    function updateLayout() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        console.log(`設備方向已變化：${isLandscape ? '橫向' : '縱向'}, 尺寸: ${screenWidth}x${screenHeight}`);
        
        // 更新方向類
        document.body.classList.toggle('ios-landscape', isLandscape);
        document.body.classList.toggle('ios-portrait', !isLandscape);
        
        // 強制應用布局樣式
        const rootStyle = document.documentElement.style;
        
        if (isLandscape) {
            // 橫向模式 - 強制4列布局
            rootStyle.setProperty('--grid-columns', '4');
            rootStyle.setProperty('--grid-gap', '15px');
            rootStyle.setProperty('--chart-height', '380px');
            rootStyle.setProperty('--panel-padding', '15px');
            
            // 直接修改網格布局
            document.querySelectorAll('.dashboard-grid').forEach(grid => {
                grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                grid.style.gridGap = '15px';
            });
            
            // 調整圖表容器
            document.querySelectorAll('.chart-container').forEach(chart => {
                chart.style.height = '380px';
            });
            
            // 適配數據行
            document.querySelectorAll('.row:not(.no-landscape-adapt)').forEach(row => {
                // 檢查行是否包含足夠的列進行橫向排列
                const cols = row.querySelectorAll('.col-md-6, .col-lg-6, [class*="col-"]');
                if (cols.length >= 2 && cols.length <= 4) {
                    // 轉換為網格布局
                    row.style.display = 'grid';
                    row.style.gridTemplateColumns = `repeat(${Math.min(cols.length, 2)}, 1fr)`;
                    row.style.gridGap = '15px';
                    row.classList.add('forced-landscape-grid');
                    
                    // 強制子元素寬度
                    cols.forEach(col => {
                        col.style.maxWidth = '100%';
                        col.style.width = '100%';
                    });
                }
            });
        } else {
            // 縱向模式 - 強制2列布局
            rootStyle.setProperty('--grid-columns', '2');
            rootStyle.setProperty('--grid-gap', '10px');
            rootStyle.setProperty('--chart-height', '320px');
            rootStyle.setProperty('--panel-padding', '12px');
            
            // 直接修改網格布局
            document.querySelectorAll('.dashboard-grid').forEach(grid => {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                grid.style.gridGap = '10px';
            });
            
            // 調整圖表容器
            document.querySelectorAll('.chart-container').forEach(chart => {
                chart.style.height = '320px';
            });
            
            // 恢復原始行布局
            document.querySelectorAll('.forced-landscape-grid').forEach(row => {
                row.style.display = '';
                row.style.gridTemplateColumns = '';
                row.style.gridGap = '';
                row.classList.remove('forced-landscape-grid');
                
                // 恢復列寬度
                const cols = row.querySelectorAll('.col-md-6, .col-lg-6, [class*="col-"]');
                cols.forEach(col => {
                    col.style.maxWidth = '';
                    col.style.width = '';
                });
            });
        }
        
        // 修復框架高度問題
        fixFrameworkHeights(isLandscape);
        
        // 觸發布局更新事件
        window.dispatchEvent(new CustomEvent('ios-layout-update', {
            detail: { isLandscape, width: screenWidth, height: screenHeight }
        }));
    }
    
    // 新增：直接修復框架容器高度
    function fixFrameworkHeights(isLandscape) {
        // 修復內容容器高度
        const contentHeight = isLandscape ? '75vh' : '70vh';
        document.querySelectorAll('.tab-content, .tab-content > .tab-pane').forEach(el => {
            el.style.minHeight = contentHeight;
            el.style.height = 'auto';
        });
        
        // 固定面板高度
        document.querySelectorAll('.panel').forEach(panel => {
            panel.style.minHeight = 'auto';
            panel.style.height = 'auto';
        });
        
        // 確保圖表響應式布局
        setTimeout(() => {
            document.querySelectorAll('.chart-container canvas').forEach(canvas => {
                const parent = canvas.parentElement;
                if (parent) {
                    canvas.style.width = '100%';
                    canvas.style.maxHeight = (isLandscape ? '350px' : '300px');
                }
            });
        }, 100);
    }
    
    // 重繪圖表
    function redrawCharts() {
        console.log('強制重繪所有圖表');
        
        // 首先嘗試使用Chart.js的resize方法
        if (window.Chart) {
            try {
                // Chart.js v3的API
                if (window.Chart.instances) {
                    Object.values(window.Chart.instances).forEach(chart => {
                        try {
                            chart.resize();
                            chart.render();
                        } catch (e) {
                            console.warn('使用Chart.js實例API重繪時出錯:', e);
                        }
                    });
                } 
                // Chart.js v2的API
                else if (Chart.helpers && Chart.helpers.each) {
                    Chart.helpers.each(Chart.instances, function(instance) {
                        try {
                            instance.resize();
                            instance.render(true);
                        } catch (e) {
                            console.warn('使用Chart.js v2 API重繪時出錯:', e);
                        }
                    });
                }
            } catch (e) {
                console.warn('嘗試使用Chart.js API重繪時出錯:', e);
            }
        }
        
        // 嘗試直接訪問圖表實例
        const chartInstanceNames = [
            'irrChartInstance', 
            'dividendChartInstance', 
            'cumulativeDividendChartInstance',
            'medicalChartInstance',
            'radarChartInstance', 
            'reportChartInstance',
            'overallChartInstance'
        ];
        
        chartInstanceNames.forEach(name => {
            if (window[name]) {
                try {
                    window[name].resize();
                    window[name].update();
                } catch (e) {
                    console.warn(`重繪${name}失敗，嘗試替代方法`);
                    
                    // 替代方法：強制重設尺寸
                    try {
                        const canvas = window[name].canvas;
                        if (canvas) {
                            const parent = canvas.parentElement;
                            if (parent) {
                                // 強制重設大小
                                canvas.style.width = '100%';
                                canvas.style.height = 'auto';
                                
                                // 強制更新
                                window[name].resize();
                                window[name].render();
                            }
                        }
                    } catch (e2) {
                        console.error(`無法重繪${name}:`, e2);
                    }
                }
            }
        });
        
        // 最後嘗試：直接處理畫布尺寸
        document.querySelectorAll('.chart-container canvas').forEach(canvas => {
            canvas.style.width = '100%';
            canvas.height = parseInt(getComputedStyle(canvas.parentNode).height);
        });
    }
    
    // 設置iOS專用樣式 - 縮短內容並改進滾動
    function addIOSStyles() {
        const iosStyles = `
        .ios-device {
            -webkit-overflow-scrolling: touch;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
        }
        
        /* 解決iPad橫向適配問題 - 直接覆蓋框架樣式 */
        @media (min-width: 768px) {
            .ios-device.ios-landscape .container {
                max-width: none !重要;
                padding-left: 20px !重要;
                padding-right: 20px !重要;
            }
            
            .ios-device.ios-landscape .dashboard-grid {
                display: grid !重要;
                grid-template-columns: repeat(4, 1fr) !重要;
                grid-gap: 15px !重要;
            }
            
            .ios-device.ios-landscape .row {
                margin-left: -10px !重要;
                margin-right: -10px !重要;
            }
            
            .ios-device.ios-landscape .chart-container {
                height: 380px !重要;
                max-height: 380px !重要;
            }
            
            .ios-device.ios-landscape canvas {
                max-height: 350px !重要;
            }
        }
        
        /* 縱向模式強制布局 */
        @media (max-width: 1024px) and (orientation: portrait) {
            .ios-device.ios-portrait .dashboard-grid {
                display: grid !重要;
                grid-template-columns: repeat(2, 1fr) !重要;
                grid-gap: 10px !重要;
            }
            
            .ios-device.ios-portrait .chart-container {
                height: 320px !重要;
                max-height: 320px !重要;
            }
        }
        
        /* 強制列布局 */
        .forced-landscape-grid {
            display: grid !重要;
        }
        
        .forced-landscape-grid > [class*="col-"] {
            max-width: 100% !重要;
            width: 100% !重要;
            padding: 0 !重要;
        }
        
        /* 縮短內容區高度，確保計算按鈕可見 */
        .ios-device .single-tab-content {
            padding-bottom: 120px !重要; /* 確保底部有足夠空間 */
        }
        
        /* 其他樣式保持不變 */
        .ios-active {
            opacity: 0.7;
            transform: scale(0.97);
            transition: all 0.1s ease;
        }
        
        /* 增大觸控目標 */
        .ios-device button,
        .ios-device .btn,
        .ios-device .nav-link {
            min-height: 44px;
        }
        
        /* 確保計算按鈕始終可點擊，不會被滾動阻擋 */
        .ios-device .btn-tech-action {
            position: relative;
            z-index: 100;
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
        if (!isIOS) return; // 提前檢查避免執行多餘代碼
        
        console.log('iOS設備檢測: iPad=' + isIPad);
        
        // 添加iOS專用樣式 - 立即添加
        addIOSStyles();
        
        // 施加修復 - 減少延遲以確保及時生效
        setTimeout(() => {
            fixIOSOverscroll();
            fixIOSTapDelay();
            fixIOSTabSwitching();
            fixIOSKeyboard();
            handleIOSHomeGesture();
            handleIOSOrientationChange(); // 這將執行初始化布局
            
            console.log('iOS觸控修復完成');
        }, 50);
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
