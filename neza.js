// ==UserScript==
// @version      2.1
// @description  哪吒详情页直接展示网络波动卡片（已完全移除自动削峰逻辑）
// @author       https://www.nodeseek.com/post-349102-1
// ==/UserScript==

(function () {
    'use strict';

    // "网络" 按钮选择器
    const selectorNetworkButton = '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';

    // Tab 切换区域的 section 选择器
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';

    // 详情图表视图
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';

    // 网络图表视图
    const selectorNetworkCharts = '.server-info > div:nth-of-type(3)';

    let hasClicked = false;
    let divVisible = false;

    function forceBothVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            detailDiv.style.display = 'block';
        }
        if (networkDiv) {
            networkDiv.style.display = 'block';
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.display = 'none';
        }
    }

    function tryClickNetworkButton() {
        const btn = document.querySelector(selectorNetworkButton);
        if (btn && !hasClicked) {
            btn.click();
            hasClicked = true;
            // 延迟确保按钮点击后图表加载
            setTimeout(forceBothVisible, 500);
        }
    }

    const observer = new MutationObserver(() => {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        const isDetailVisible = detailDiv && getComputedStyle(detailDiv).display !== 'none';
        const isNetworkVisible = networkDiv && getComputedStyle(networkDiv).display !== 'none';

        const isAnyDivVisible = isDetailVisible || isNetworkVisible;

        // 如果视图可见，隐藏Tab并点击网络按钮
        if (isAnyDivVisible && !divVisible) {
            hideTabSection();
            tryClickNetworkButton();
            // 已删除 tryClickPeak 的调用
        } else if (!isAnyDivVisible && divVisible) {
            hasClicked = false;
        }

        divVisible = isAnyDivVisible;

        // 强制确保两个视图都可见
        if (detailDiv && networkDiv) {
            if (!isDetailVisible || !isNetworkVisible) {
                forceBothVisible();
            }
        }
    });

    const root = document.querySelector('#root');
    if (root) {
        observer.observe(root, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
    }
})();
