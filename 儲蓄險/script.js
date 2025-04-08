// 全局變量
let policyData = {};
let currentModule = 'basic';
let showMarketComparison = false;

// 計算與比較函數
function calculateAndCompare() {
    console.log(" 計算分析按鈕被點擊 ");
    
    // 顯示載入動畫
    showLoading();
    
    setTimeout(() => {
        try {
            // 獲取基本數據
            const term = parseInt(document.getElementById('policyTerm').value);
            const currencyType = document.getElementById('currencyType').value;
            
            // 醫療險附加功能
            const medicalData = {
                hasCriticalIllness: document.getElementById('criticalIllness').checked,
                hasHospitalization: document.getElementById('hospitalization').checked,
                hasSurgery: document.getElementById('surgery').checked,
                hasCancerProtection: document.getElementById('cancerProtection')?.checked || false,
                hasLongTermCare: document.getElementById('longTermCare')?.checked || false,
                coverage: parseFloat(document.getElementById('medicalCoverage').value) || 0,
                premiumRate: parseFloat(document.getElementById('medicalPremium').value) || 0
            };
            
            // 驗證自家保單數據 - 添加壽險額度
            const ownName = document.getElementById('ownName').value || ' 自家保單 ';
            const ownPremium = parseFloat(document.getElementById('ownPremium').value) * 10000; // 萬轉元
            const ownRate = parseFloat(document.getElementById('ownRate').value);
            const ownDividend = parseFloat(document.getElementById('ownDividend').value) * 10000; // 萬轉元
            const ownSurrender = parseFloat(document.getElementById('ownSurrender').value) * 10000; // 萬轉元
            const ownLifeInsurance = parseFloat(document.getElementById('ownLifeInsurance').value) * 10000; // 萬轉元
            const ownLifeInsuranceTerm = parseInt(document.getElementById('ownLifeInsuranceTerm').value || term);
            const ownHasMedical = true; // 自家保單默認包含醫療
            
            console.log(" 已獲取保單數據 :", {term, currencyType, medicalData, ownName, ownPremium, ownRate, ownDividend, ownSurrender, ownLifeInsurance});
            
            if (isNaN(ownPremium) || isNaN(ownRate) || isNaN(ownSurrender)) {
                alert(' 請填寫自家保單的完整資料 ');
                hideLoading();
                return;
            }
            
            // 獲取競品數據 ( 可選，不強制 ) - 添加壽險額度
            const compAName = document.getElementById('compA-name').value || ' 競品 A';
            const compAPremium = parseFloat(document.getElementById('compA-premium').value) * 10000; // 萬轉元
            const compARate = parseFloat(document.getElementById('compA-rate').value);
            const compADividend = parseFloat(document.getElementById('compA-dividend').value) * 10000; // 萬轉元
            const compASurrender = parseFloat(document.getElementById('compA-surrender').value) * 10000; // 萬轉元
            const compALifeInsurance = parseFloat(document.getElementById('compA-lifeInsurance').value) * 10000; // 萬轉元
            const compALifeInsuranceTerm = parseInt(document.getElementById('compA-lifeInsuranceTerm').value || term);
            const compAHasMedical = document.getElementById('compA-medical')?.checked || false;
            const hasCompA = !isNaN(compAPremium) && !isNaN(compARate) && !isNaN(compASurrender);
            
            const compBName = document.getElementById('compB-name').value || ' 競品 B';
            const compBPremium = parseFloat(document.getElementById('compB-premium').value) * 10000; // 萬轉元
            const compBRate = parseFloat(document.getElementById('compB-rate').value);
            const compBDividend = parseFloat(document.getElementById('compB-dividend').value) * 10000; // 萬轉元
            const compBSurrender = parseFloat(document.getElementById('compB-surrender').value) * 10000; // 萬轉元
            const compBLifeInsurance = parseFloat(document.getElementById('compB-lifeInsurance').value) * 10000; // 萬轉元
            const compBLifeInsuranceTerm = parseInt(document.getElementById('compB-lifeInsuranceTerm').value || term);
            const compBHasMedical = document.getElementById('compB-medical')?.checked || false;
            const hasCompB = !isNaN(compBPremium) && !isNaN(compBRate) && !isNaN(compBSurrender);
            
            const compCName = document.getElementById('compC-name').value || ' 競品 C';
            const compCPremium = parseFloat(document.getElementById('compC-premium').value) * 10000; // 萬轉元
            const compCRate = parseFloat(document.getElementById('compC-rate').value);
            const compCDividend = parseFloat(document.getElementById('compC-dividend').value) * 10000; // 萬轉元
            const compCSurrender = parseFloat(document.getElementById('compC-surrender').value) * 10000; // 萬轉元
            const compCLifeInsurance = parseFloat(document.getElementById('compC-lifeInsurance').value) * 10000; // 萬轉元
            const compCLifeInsuranceTerm = parseInt(document.getElementById('compC-lifeInsuranceTerm').value || term);
            const compCHasMedical = document.getElementById('compC-medical')?.checked || false;
            const hasCompC = !isNaN(compCPremium) && !isNaN(compCRate) && !isNaN(compCSurrender);
            
            // 獲取高級分析選項
            const advancedOptions = {
                // ...existing code...
            };
            
            // 客戶風險與需求分析
            const clientData = {
                // ...existing code...
            };
            
            // 建立保單數據結構 ( 先加入自家保單 )
            policyData = {
                own: {
                    name: ownName,
                    premium: ownPremium,
                    rate: ownRate,
                    dividend: ownDividend,
                    dividendAmount: ownDividend, // 明確添加年配息金額
                    surrender: ownSurrender,
                    term: term,
                    lifeInsurance: ownLifeInsurance,
                    lifeInsuranceTerm: ownLifeInsuranceTerm,
                    hasMedical: ownHasMedical,
                    medical: {
                        criticalIllness: medicalData.hasCriticalIllness,
                        hospitalization: medicalData.hasHospitalization,
                        surgery: medicalData.hasSurgery,
                        cancerProtection: medicalData.hasCancerProtection, 
                        longTermCare: medicalData.hasLongTermCare,
                        coverage: medicalData.coverage,
                        premiumRate: medicalData.premiumRate,
                        additionalPremium: ownPremium * (medicalData.premiumRate / 100)
                    }
                }
            };
            
            // 如果有競品數據，則加入 ( 完全可選 )
            if (hasCompA) {
                policyData.compA = {
                    name: compAName,
                    premium: compAPremium,
                    rate: compARate,
                    dividend: compADividend,
                    dividendAmount: compADividend, // 明確添加年配息金額
                    surrender: compASurrender,
                    term: term,
                    lifeInsurance: compALifeInsurance,
                    lifeInsuranceTerm: compALifeInsuranceTerm,
                    hasMedical: compAHasMedical,
                    medical: {
                        criticalIllness: compAHasMedical && Math.random() > 0.3,
                        hospitalization: compAHasMedical && Math.random() > 0.2,
                        surgery: compAHasMedical && Math.random() > 0.5,
                        cancerProtection: compAHasMedical && Math.random() > 0.4,
                        longTermCare: compAHasMedical && Math.random() > 0.6,
                        coverage: compAHasMedical ? medicalData.coverage * 0.9 : 0,
                        premiumRate: compAHasMedical ? medicalData.premiumRate * 1.1 : 0,
                        additionalPremium: compAHasMedical ? compAPremium * ((medicalData.premiumRate * 1.1) / 100) : 0
                    }
                };
            }
            
            if (hasCompB) {
                policyData.compB = {
                    name: compBName,
                    premium: compBPremium,
                    rate: compBRate,
                    dividend: compBDividend, // 年配息
                    surrender: compBSurrender,
                    term: term,
                    lifeInsurance: compBLifeInsurance,
                    lifeInsuranceTerm: compBLifeInsuranceTerm,
                    hasMedical: compBHasMedical,
                    medical: {
                        criticalIllness: compBHasMedical && Math.random() > 0.3,
                        hospitalization: compBHasMedical && Math.random() > 0.2,
                        surgery: compBHasMedical && Math.random() > 0.5,
                        cancerProtection: compBHasMedical && Math.random() > 0.4,
                        longTermCare: compBHasMedical && Math.random() > 0.6,
                        coverage: compBHasMedical ? medicalData.coverage * 0.9 : 0,
                        premiumRate: compBHasMedical ? medicalData.premiumRate * 1.1 : 0,
                        additionalPremium: compBHasMedical ? compBPremium * ((medicalData.premiumRate * 1.1) / 100) : 0
                    }
                };
            }
            
            if (hasCompC) {
                policyData.compC = {
                    name: compCName,
                    premium: compCPremium,
                    rate: compCRate,
                    dividend: compCDividend, // 年配息
                    surrender: compCSurrender,
                    term: term,
                    lifeInsurance: compCLifeInsurance,
                    lifeInsuranceTerm: compCLifeInsuranceTerm,
                    hasMedical: compCHasMedical,
                    medical: {
                        criticalIllness: compCHasMedical && Math.random() > 0.3,
                        hospitalization: compCHasMedical && Math.random() > 0.2,
                        surgery: compCHasMedical && Math.random() > 0.5,
                        cancerProtection: compCHasMedical && Math.random() > 0.4,
                        longTermCare: compCHasMedical && Math.random() > 0.6,
                        coverage: compCHasMedical ? medicalData.coverage * 0.9 : 0,
                        premiumRate: compCHasMedical ? medicalData.premiumRate * 1.1 : 0,
                        additionalPremium: compCHasMedical ? compCPremium * ((medicalData.premiumRate * 1.1) / 100) : 0
                    }
                };
            }
            
            // 如果沒有任何競品數據，自動生成市場參考數據以提供比較基準
            if (!hasCompA && !hasCompB && !hasCompC) {
                // 生成市場平均參考數據
                policyData.marketAverage = {
                    name: ' 市場平均產品 ',
                    premium: ownPremium * 0.95,
                    rate: ownRate * 0.9,
                    dividend: ownDividend * 0.9, // 年配息略低於自家產品
                    surrender: ownSurrender * 0.92,
                    term: term,
                    lifeInsurance: ownLifeInsurance * 0.9,
                    lifeInsuranceTerm: ownLifeInsuranceTerm,
                    hasMedical: true,
                    medical: {
                        criticalIllness: Math.random() > 0.3,
                        hospitalization: Math.random() > 0.2,
                        surgery: Math.random() > 0.5,
                        cancerProtection: Math.random() > 0.4,
                        longTermCare: Math.random() > 0.6,
                        coverage: medicalData.coverage * 0.9,
                        premiumRate: medicalData.premiumRate * 1.1,
                        additionalPremium: ownPremium * ((medicalData.premiumRate * 1.1) / 100)
                    }
                };
                
                // 生成市場優質參考數據
                policyData.marketPremium = {
                    name: ' 市場優質產品 ',
                    premium: ownPremium * 1.05,
                    rate: ownRate * 1.1,
                    dividend: ownDividend * 1.1, // 年配息高於自家產品
                    surrender: ownSurrender * 1.08,
                    term: term,
                    lifeInsurance: ownLifeInsurance * 1.1,
                    lifeInsuranceTerm: ownLifeInsuranceTerm,
                    hasMedical: true,
                    medical: {
                        criticalIllness: Math.random() > 0.3,
                        hospitalization: Math.random() > 0.2,
                        surgery: Math.random() > 0.5,
                        cancerProtection: Math.random() > 0.4,
                        longTermCare: Math.random() > 0.6,
                        coverage: medicalData.coverage * 0.9,
                        premiumRate: medicalData.premiumRate * 1.1,
                        additionalPremium: ownPremium * ((medicalData.premiumRate * 1.1) / 100)
                    }
                };
            }
            
            // 儲存貨幣類型與高級分析選項
            policyData.currencyType = currencyType;
            policyData.advancedOptions = advancedOptions;
            policyData.clientData = clientData;
            
            // 計算各保單指標
            calculatePolicyMetrics();
            
            // 新增：計算配息相關指標
            calculateDividendMetrics();
            
            // 計算醫療險評分
            calculateMedicalScores();
            
            // 計算綜合評分
            calculateOverallScores();
            
            // 設置比較顯示控制
            setupComparisonControls();
            
            // 更新 UI
            updateComparisonTables();
            updateDividendAnalysis(); // 新增：配息分析
            updateMedicalAnalysis();
            updateComprehensiveAnalysis();
            updateBadges();
            renderCharts();
            
            // 啟用比較表頁籤
            const comparisonTab = document.getElementById('comparison-tab');
            comparisonTab.disabled = false;
            comparisonTab.classList.add('unlocked');
            
            // 隱藏載入動畫
            hideLoading();
            
            // 切換到比較表頁籤 - 使用修正後的頁籤切換函數
            switchTab('comparison');
            
            // 更新 AI 訊息
            const bestPolicy = findBestPolicy();
            updateAiMessage(` 分析完成！${bestPolicy.name} 綜合評分為 ${bestPolicy.overallScore.toFixed(1)} 分，在報酬與醫療保障方面表現優異。您可點擊分析標籤查看不同維度的比較。`);
            
            console.log(" 分析完成 ");
        } catch (error) {
            console.error(" 計算過程中出錯 :", error);
            alert(" 計算過程中出錯 : " + error.message);
            hideLoading();
        }
    }, 2000); // 模擬計算延遲
}

// 找到最佳保單
function findBestPolicy() {
    // 找出綜合評分最高的保單
    return Object.values(policyData)
        .filter(p => typeof p === 'object' && p.name && p.overallScore !== undefined)
        .sort((a, b) => b.overallScore - a.overallScore)[0] || { name: ' 自家保單 ', overallScore: 0 };
}

// 計算保單指標
function calculatePolicyMetrics() {
    console.log(" 正在計算保單指標 ...");
    
    // 遍歷所有保單並計算指標
    Object.keys(policyData).forEach(key => {
        if (key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData') {
            const policy = policyData[key];
            
            // 計算 IRR（內部收益率）：簡化計算
            const totalPremium = policy.premium * policy.term;
            policy.irr = Math.pow((policy.surrender / totalPremium), (1 / policy.term)) - 1;
            
            // 計算總保費
            policy.totalPremium = totalPremium;
            
            // 計算報酬率
            policy.returnRate = ((policy.surrender - policy.totalPremium) / policy.totalPremium) * 100;
            
            // 計算與自家保單差異
            policy.surrenderDiff = policy.surrender - policyData.own.surrender;
            policy.surrenderDiffPercentage = (policy.surrenderDiff / policyData.own.surrender) * 100;
            
            // 利率敏感度分析
            policy.sensitivity = {
                lower: Math.pow((policy.surrender * 0.95 / totalPremium), (1 / policy.term)) - 1,
                higher: Math.pow((policy.surrender * 1.05 / totalPremium), (1 / policy.term)) - 1
            };
            policy.sensitivity.range = policy.sensitivity.higher - policy.sensitivity.lower;
        }
    });
    
    console.log(" 保單指標計算完成 ");
}

// 計算配息相關指標
function calculateDividendMetrics() {
    console.log(" 計算配息相關指標 ...");
    
    Object.keys(policyData).forEach(key => {
        if (key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData') {
            const policy = policyData[key];
            
            // 確保 dividend 有值 ( 保險公司給的配息率 )，這裡可能需要與前端欄位匹配
            policy.dividend = policy.dividend || 0;
            
            // 計算年配息金額
            policy.dividendAmount = policy.dividendAmount || 0;
            
            // 配息評分 (1-10 分 )
            policy.dividendScore = Math.min(10, (policy.dividendAmount / policy.premium) * 100) || 0;
            
            // 計算長期配息數據 - 包含利息
            policy.longTerm = {
                years: [1, 5, 10, 15, 20],
                dividends: Array(5).fill(policy.dividendAmount),
                cumulativeDividends: [],
                cumulativeDividendsWithInterest: []
            };
            
            // 計算各年份累積配息
            let cumulativeDiv = 0;
            let cumulativeDivWithInterest = 0;
            const interestRate = policy.rate / 100; // 使用保單利率作為配息再投資利率
            
            for (let i = 0; i < 5; i++) {
                const year = policy.longTerm.years[i];
                
                // 單純累積 ( 不含利息 )
                cumulativeDiv = policy.dividendAmount * year;
                policy.longTerm.cumulativeDividends.push(cumulativeDiv);
                
                // 含利息累積 ( 複利計算 )
                cumulativeDivWithInterest = 0;
                for (let j = 0; j < year; j++) {
                    // 之前累積的部分產生利息
                    cumulativeDivWithInterest = cumulativeDivWithInterest * (1 + interestRate);
                    // 加上當年配息
                    cumulativeDivWithInterest += policy.dividendAmount;
                }
                
                policy.longTerm.cumulativeDividendsWithInterest.push(cumulativeDivWithInterest);
            }
        }
    });
    
    console.log(" 配息相關指標計算完成 ");
}

// 計算醫療險評分
function calculateMedicalScores() {
    console.log(" 正在計算醫療險評分 ...");
    
    Object.keys(policyData).forEach(key => {
        if (key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData') {
            const policy = policyData[key];
            if (!policy.hasMedical) {
                policy.medicalScore = 0;
                policy.medicalDescription = ' 無醫療保障 ';
                return;
            }
            
            // 計算醫療評分
            let score = 0;
            
            // 基礎分數
            score += 3;
            
            // 根據包含的醫療功能加分
            if (policy.medical.criticalIllness) score += 2;
            if (policy.medical.hospitalization) score += 1.5;
            if (policy.medical.surgery) score += 1.5;
            
            // 根據保障額度加分，最多加 2 分
            score += Math.min(2, policy.medical.coverage / 100000);
            
            // 保費比例評估 ( 較低比例得分較高 )，最多加 2 分
            score += Math.max(0, 2 - policy.medical.premiumRate / 10);
            
            // 存儲醫療評分，最高 10 分
            policy.medicalScore = Math.min(10, score);
            
            // 生成醫療保障描述
            const features = [];
            if (policy.medical.criticalIllness) features.push(" 重大疾病 ");
            if (policy.medical.hospitalization) features.push(" 住院給付 ");
            if (policy.medical.surgery) features.push(" 手術保障 ");
            
            policy.medicalDescription = features.length > 0 ? features.join(", ") : " 基本醫療 ";
        }
    });
    
    console.log(" 醫療險評分計算完成 ");
}

// 計算綜合評分
function calculateOverallScores() {
    console.log(" 正在計算綜合評分 ...");
    
    // 獲取權重設置
    const returnWeight = 0.35; // 報酬權重
    const dividendWeight = 0.25; // 配息權重
    const medicalWeight = 0.15; // 醫療權重
    const lifeInsuranceWeight = 0.25; // 壽險權重
    
    // 找出 IRR 的最大和最小值以便標準化
    let maxIRR = -Infinity;
    let minIRR = Infinity;
    let maxDividend = -Infinity;
    let minDividend = Infinity;
    let maxLifeInsurance = -Infinity;
    let minLifeInsurance = Infinity;
    
    Object.keys(policyData).forEach(key => {
        if (key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData') {
            const policy = policyData[key];
            if (policy.irr !== undefined) {
                maxIRR = Math.max(maxIRR, policy.irr);
                minIRR = Math.min(minIRR, policy.irr);
            }
            
            if (policy.dividendAmount !== undefined) {
                const dividendRate = policy.dividendAmount / policy.premium;
                maxDividend = Math.max(maxDividend, dividendRate);
                minDividend = Math.min(minDividend, dividendRate);
            }
            
            if (policy.lifeInsurance !== undefined) {
                const lifeInsuranceRatio = policy.lifeInsurance / policy.premium;
                maxLifeInsurance = Math.max(maxLifeInsurance, lifeInsuranceRatio);
                minLifeInsurance = Math.min(minLifeInsurance, lifeInsuranceRatio);
            }
        }
    });
    
    const irrRange = maxIRR - minIRR > 0 ? maxIRR - minIRR : 1;
    const dividendRange = maxDividend - minDividend > 0 ? maxDividend - minDividend : 1;
    const lifeInsuranceRange = maxLifeInsurance - minLifeInsurance > 0 ? maxLifeInsurance - minLifeInsurance : 1;
    
    Object.keys(policyData).forEach(key => {
        if (key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData') {
            const policy = policyData[key];
            
            // 報酬評分 ( 基於 IRR 的標準化 )
            policy.returnScore = 10 * ((policy.irr - minIRR) / irrRange);
            
            // 配息評分 ( 基於配息率標準化 )
            const dividendRate = policy.dividendAmount / policy.premium;
            policy.dividendScore = 10 * ((dividendRate - minDividend) / dividendRange);
            
            // 壽險評分 ( 基於壽險金額與保費比例標準化 )
            const lifeInsuranceRatio = policy.lifeInsurance / policy.premium;
            policy.lifeInsuranceScore = 10 * ((lifeInsuranceRatio - minLifeInsurance) / lifeInsuranceRange);
            
            // 綜合評分 - 考慮所有因素
            policy.overallScore = (policy.returnScore * returnWeight) + 
                               (policy.dividendScore * dividendWeight) + 
                               (policy.medicalScore * medicalWeight) + 
                               (policy.lifeInsuranceScore * lifeInsuranceWeight);
                               
            // 明確顯示比較基準
            policy.comparisonBase = {
                returnBase: policyData.own.returnScore,
                dividendBase: policyData.own.dividendScore,
                medicalBase: policyData.own.medicalScore,
                lifeInsuranceBase: policyData.own.lifeInsuranceScore,
                overallBase: policyData.own.overallScore
            };
            
            // 與自家保單比較的得分百分比
            policy.scoreVsOwn = (policy.overallScore / policyData.own.overallScore) * 100;
        }
    });
    
    // 基於綜合評分進行排名
    const policies = Object.keys(policyData)
        .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
        .map(key => policyData[key])
        .sort((a, b) => b.overallScore - a.overallScore);
    
    policies.forEach((policy, index) => {
        policy.rank = index + 1;
    });
    
    console.log(" 綜合評分計算完成 ");
}

// 更新對比表格
function updateComparisonTables() {
    console.log(" 正在更新對比表格 ...");
    
    // 更新 IRR 比較表
    const irrTable = document.getElementById('irrTable');
    if (irrTable) {
        irrTable.innerHTML = '';
        
        const policies = Object.keys(policyData)
            .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
            .map(key => policyData[key])
            .sort((a, b) => b.irr - a.irr);
        
        policies.forEach((policy, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${policy.name}</td>
                <td>${(policy.irr * 100).toFixed(2)}%</td>
                <td>${index + 1}</td>
            `;
            irrTable.appendChild(row);
        });
    }
    
    // 更新解約金比較表
    const surrenderTable = document.getElementById('surrenderTable');
    if (surrenderTable) {
        const tbody = surrenderTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            const policies = Object.keys(policyData)
                .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
                .map(key => policyData[key]);
            
            policies.forEach(policy => {
                const row = document.createElement('tr');
                const currencySymbol = policyData.currencyType === 'USD' ? '$' : 'NT$';
                const diffText = policy.name === policyData.own.name ? 
                    ' 基準 ' : policy.surrenderDiff >= 0 ? 
                    `+${currencySymbol}${policy.surrenderDiff.toLocaleString()} (${policy.surrenderDiffPercentage.toFixed(2)}%)` : 
                    `${currencySymbol}${policy.surrenderDiff.toLocaleString()} (${policy.surrenderDiffPercentage.toFixed(2)}%)`;
                
                row.innerHTML = `
                    <td>${policy.name}</td>
                    <td>${currencySymbol}${policy.surrender.toLocaleString()}</td>
                    <td>${diffText}</td>
                    <td>${currencySymbol}${policy.totalPremium.toLocaleString()}</td>
                    <td>${policy.returnRate.toFixed(2)}%</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    // 更新敏感度分析表
    const sensitivityTable = document.getElementById('sensitivityTable');
    if (sensitivityTable) {
        const tbody = sensitivityTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            const policies = Object.keys(policyData)
                .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
                .map(key => policyData[key])
                .sort((a, b) => a.sensitivity.range - b.sensitivity.range);
            
            policies.forEach(policy => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${policy.name}</td>
                    <td>${(policy.sensitivity.lower * 100).toFixed(2)}%</td>
                    <td>${(policy.irr * 100).toFixed(2)}%</td>
                    <td>${(policy.sensitivity.higher * 100).toFixed(2)}%</td>
                    <td>${(policy.sensitivity.range * 100).toFixed(2)}%</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    console.log(" 對比表格更新完成 ");
}

// 更新配息分析
function updateDividendAnalysis() {
    console.log(" 更新配息分析 ...");
    
    // 獲取要顯示的保單
    const policies = getFilteredPolicies(
        document.getElementById('showOwnOnly')?.checked || false,
        showMarketComparison
    );
    
    // 更新配息比較表
    const dividendTable = document.getElementById('dividendTable');
    if (dividendTable) {
        dividendTable.innerHTML = '';
        
        // 根據配息金額排序
        const sortedPolicies = [...policies].sort((a, b) => b.dividendAmount - a.dividendAmount);
        
        sortedPolicies.forEach((policy, index) => {
            const row = document.createElement('tr');
            const currencySymbol = policyData.currencyType === 'USD' ? '$' : 'NT$';
            const dividendAmount = policy.dividendAmount / 10000; // 元轉萬
            const dividendRate = (policy.dividendAmount / policy.premium * 100).toFixed(2);
            
            row.innerHTML = `
                <td>${policy.name}</td>
                <td>${dividendRate}%</td>
                <td>${currencySymbol}${Math.round(dividendAmount).toLocaleString()} 萬 </td>
                <td>${index + 1}</td>
            `;
            dividendTable.appendChild(row);
        });
    }
    
    // 更新配息累積效益表
    const cumulativeDividendTable = document.getElementById('cumulativeDividendTable');
    if (cumulativeDividendTable) {
        const tbody = cumulativeDividendTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            policies.forEach(policy => {
                if (!policy.longTerm) return;
                
                const row = document.createElement('tr');
                const currencySymbol = policyData.currencyType === 'USD' ? '$' : 'NT$';
                
                // 取得 20 年的累積配息和含利息配息
                const totalDividend = policy.longTerm.cumulativeDividends[4] / 10000; // 元轉萬 ( 第 5 個元素是 20 年 )
                const totalDividendWithInterest = policy.longTerm.cumulativeDividendsWithInterest[4] / 10000; // 元轉萬
                const interestEarned = totalDividendWithInterest - totalDividend;
                const growthRate = ((totalDividendWithInterest / totalDividend - 1) * 100).toFixed(2);
                
                row.innerHTML = `
                    <td>${policy.name}</td>
                    <td>${currencySymbol}${Math.round(totalDividend).toLocaleString()} 萬 </td>
                    <td>${currencySymbol}${Math.round(interestEarned).toLocaleString()} 萬 </td>
                    <td>${currencySymbol}${Math.round(totalDividendWithInterest).toLocaleString()} 萬 </td>
                    <td>${growthRate}%</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    // 渲染配息圖表
    renderDividendCharts(policies);
}

// 渲染配息圖表
function renderDividendCharts(policies) {
    // 配息率條形圖 - 使用多彩顏色
    const dividendCtx = document.getElementById('dividendChart');
    if (dividendCtx) {
        if (window.dividendChartInstance) {
            window.dividendChartInstance.destroy();
        }
        
        // 定義螢光色彩漸變
        const glowColors = [
            'rgba(0, 229, 255, 0.7)',  // 藍
            'rgba(0, 255, 157, 0.7)',  // 綠
            'rgba(255, 214, 0, 0.7)',  // 黃
            'rgba(255, 82, 171, 0.7)', // 粉
            'rgba(155, 89, 255, 0.7)'  // 紫
        ];
        
        window.dividendChartInstance = new Chart(dividendCtx, {
            type: 'bar',
            data: {
                labels: policies.map(p => p.name),
                datasets: [{
                    label: ' 年配息金額 ( 萬 )',
                    data: policies.map(p => (p.dividendAmount / 10000).toFixed(2)),
                    backgroundColor: policies.map((_, i) => glowColors[i % glowColors.length]),
                    borderColor: policies.map((_, i) => glowColors[i % glowColors.length].replace('0.7', '1')),
                    borderWidth: 1,
                    borderRadius: 5,
                    hoverBackgroundColor: policies.map((_, i) => glowColors[i % glowColors.length].replace('0.7', '0.9'))
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const currencySymbol = policyData.currencyType === 'USD' ? '$' : 'NT$';
                                return ` 配息金額 : ${currencySymbol}${context.raw} 萬 `;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: ' 年配息金額 ( 萬 )'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    // 配息累積效益圖表 - 顯示 1-5-10-15-20 年數據
    const cumulativeCtx = document.getElementById('cumulativeDividendChart');
    if (cumulativeCtx) {
        if (window.cumulativeDividendChartInstance) {
            window.cumulativeDividendChartInstance.destroy();
        }
        
        // 過濾有長期數據的保單
        const policiesWithData = policies.filter(p => p.longTerm);
        
        // 創建數據集
        const datasets = [];
        
        // 定義螢光色彩
        const glowColors = [
            'rgba(0, 229, 255, 0.7)',  // 藍
            'rgba(0, 255, 157, 0.7)',  // 綠
            'rgba(255, 214, 0, 0.7)',  // 黃
            'rgba(255, 82, 171, 0.7)', // 粉
            'rgba(155, 89, 255, 0.7)'  // 紫
        ];
        
        // 添加累積配息數據集 ( 不含利息 )
        policiesWithData.forEach((policy, index) => {
            datasets.push({
                label: `${policy.name} ( 不含利息 )`,
                data: policy.longTerm.cumulativeDividends.map(v => Math.round(v / 10000)),
                borderColor: glowColors[index % glowColors.length].replace('0.7', '1'),
                backgroundColor: 'transparent',
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: glowColors[index % glowColors.length],
                tension: 0.3,
                fill: false
            });
            
            // 添加含利息累積配息數據集
            datasets.push({
                label: `${policy.name} ( 含利息 )`,
                data: policy.longTerm.cumulativeDividendsWithInterest.map(v => Math.round(v / 10000)),
                borderColor: glowColors[index % glowColors.length].replace('0.7', '1'),
                backgroundColor: glowColors[index % glowColors.length].replace('0.7', '0.2'),
                borderWidth: 3,
                pointBackgroundColor: glowColors[index % glowColors.length],
                tension: 0.3,
                fill: true
            });
        });
        
        window.cumulativeDividendChartInstance = new Chart(cumulativeCtx, {
            type: 'line',
            data: {
                labels: [1, 5, 10, 15, 20].map(year => `${year} 年 `),
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const currencySymbol = policyData.currencyType === 'USD' ? '$' : 'NT$';
                                return `${context.dataset.label}: ${currencySymbol}${context.raw} 萬 `;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: ' 累積配息金額 ( 萬 )'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: ' 保單年度 '
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
}

// 更新醫療分析
function updateMedicalAnalysis() {
    console.log(" 正在更新醫療分析 ...");
    
    // 更新醫療保障比較表
    const medicalTable = document.getElementById('medicalTable');
    if (medicalTable) {
        medicalTable.innerHTML = '';
        
        const policies = Object.keys(policyData)
            .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
            .map(key => policyData[key])
            .sort((a, b) => b.medicalScore - a.medicalScore);
        
        policies.forEach(policy => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${policy.name}</td>
                <td>${policy.hasMedical ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
                <td>${policy.hasMedical ? policy.medicalDescription : ' 無醫療保障 '}</td>
                <td>${policy.medicalScore.toFixed(1)}</td>
            `;
            medicalTable.appendChild(row);
        });
    }
    
    // 更新醫療詳細表格
    const medicalDetailTable = document.getElementById('medicalDetailTable');
    if (medicalDetailTable) {
        const tbody = medicalDetailTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            const policies = Object.keys(policyData)
                .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
                .map(key => policyData[key]);
            
            policies.forEach(policy => {
                if (!policy.hasMedical) return;
                
                const currencySymbol = policyData.currencyType === 'USD' ? '$' : 'NT$';
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${policy.name}</td>
                    <td>${policy.medical.criticalIllness ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
                    <td>${policy.medical.hospitalization ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
                    <td>${policy.medical.surgery ? '<i class="fas fa-check-circle text-success"></i>' : '<i class="fas fa-times-circle text-danger"></i>'}</td>
                    <td>${currencySymbol}${Math.round(policy.medical.additionalPremium).toLocaleString()}</td>
                    <td>${currencySymbol}${policy.medical.coverage.toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    // 更新醫療效益分析
    const medicalEfficiencyAlert = document.getElementById('medicalEfficiencyAlert');
    if (medicalEfficiencyAlert) {
        const policies = Object.keys(policyData)
            .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
            .map(key => policyData[key])
            .filter(p => p.hasMedical)
            .sort((a, b) => b.medicalScore - a.medicalScore);
        
        if (policies.length > 0) {
            const bestPolicy = policies[0];
            medicalEfficiencyAlert.innerHTML = `
                <p><strong>${bestPolicy.name}</strong> 提供了最佳的醫療保障，評分為 <strong>${bestPolicy.medicalScore.toFixed(1)}</strong>。</p>
                <p> 主要保障包括 : ${bestPolicy.medicalDescription}，醫療保障額度 ${policyData.currencyType === 'USD' ? '$' : 'NT$'}${bestPolicy.medical.coverage.toLocaleString()}。</p>
                <p> 醫療附加保費占總保費的 ${bestPolicy.medical.premiumRate.toFixed(1)}%，每年約 ${policyData.currencyType === 'USD' ? '$' : 'NT$'}${Math.round(bestPolicy.medical.additionalPremium).toLocaleString()}。</p>
            `;
        } else {
            medicalEfficiencyAlert.innerHTML = '<p> 沒有保單包含醫療保障功能。</p>';
        }
    }
    
    console.log(" 醫療分析更新完成 ");
}

// 更新綜合分析
function updateComprehensiveAnalysis() {
    console.log(" 正在更新綜合分析 ...");
    
    // 更新綜合評分表
    const overallTable = document.getElementById('overallTable');
    if (overallTable) {
        const tbody = overallTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            const policies = Object.keys(policyData)
                .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
                .map(key => policyData[key])
                .sort((a, b) => b.overallScore - a.overallScore);
            
            policies.forEach((policy, index) => {
                const row = document.createElement('tr');
                
                // 計算各項與基準值的比例
                const returnRatio = ((policy.returnScore / policyData.own.returnScore) * 100).toFixed(1);
                const dividendRatio = ((policy.dividendScore / policyData.own.dividendScore) * 100).toFixed(1);
                const medicalRatio = ((policy.medicalScore / policyData.own.medicalScore) * 100).toFixed(1);
                const lifeInsuranceRatio = ((policy.lifeInsuranceScore / policyData.own.lifeInsuranceScore) * 100).toFixed(1);
                
                row.innerHTML = `
                    <td>${policy.name}</td>
                    <td>${policy.returnScore.toFixed(1)} <small>(${returnRatio}%)</small></td>
                    <td>${policy.dividendScore.toFixed(1)} <small>(${dividendRatio}%)</small></td>
                    <td>${policy.medicalScore.toFixed(1)} <small>(${medicalRatio}%)</small></td>
                    <td>${policy.lifeInsuranceScore.toFixed(1)} <small>(${lifeInsuranceRatio}%)</small></td>
                    <td>${policy.overallScore.toFixed(1)}</td>
                    <td>${index + 1}</td>
                `;
                
                // 突出顯示最佳綜合評分
                if (index === 0) {
                    row.classList.add('best-performance');
                }
                
                tbody.appendChild(row);
            });
        }
    }
    
    // 更新綜合分析建議
    const comprehensiveAnalysisAlert = document.getElementById('comprehensiveAnalysisAlert');
    if (comprehensiveAnalysisAlert) {
        const policies = Object.keys(policyData)
            .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
            .map(key => policyData[key])
            .sort((a, b) => b.overallScore - a.overallScore);
        
        if (policies.length > 0) {
            const bestPolicy = policies[0];
            comprehensiveAnalysisAlert.innerHTML = `
                <p> 根據綜合評估，<strong>${bestPolicy.name}</strong> 是最佳選擇，綜合評分為 <strong>${bestPolicy.overallScore.toFixed(1)}</strong>。</p>
                <p> 評分比較基準為 <strong> 自家保單 </strong>，比較項目包括：年化報酬率 (35%)、年配息 (25%)、醫療保障 (15%) 和壽險保障 (25%)。</p>
                <p> 此保單在報酬方面得分 ${bestPolicy.returnScore.toFixed(1)}，配息方面得分 ${bestPolicy.dividendScore.toFixed(1)}，
                醫療保障得分 ${bestPolicy.medicalScore.toFixed(1)}，壽險保障得分 ${bestPolicy.lifeInsuranceScore.toFixed(1)}。</p>
                <p> 其年化報酬率 ${(bestPolicy.irr * 100).toFixed(2)}% 在所有產品中 ${policies[0] === bestPolicy ? ' 居首位 ' : ' 表現優異 '}，
                期末解約金為 ${policyData.currencyType === 'USD' ? '$' : 'NT$'}${(bestPolicy.surrender / 10000).toLocaleString()} 萬。</p>
                <p> 建議根據客戶風險偏好及保障需求，選擇最適合的保單組合。</p>
            `;
        }
    }
    
    console.log(" 綜合分析更新完成 ");
}

// 更新獎章標記
function updateBadges() {
    console.log(" 正在更新獎章標記 ...");
    
    // 獲取排序後的保單列表
    const irrPolicies = Object.keys(policyData)
        .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
        .map(key => policyData[key])
        .sort((a, b) => b.irr - a.irr);
    
    const returnPolicies = Object.keys(policyData)
        .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
        .map(key => policyData[key])
        .sort((a, b) => b.returnRate - a.returnRate);
    
    const medicalPolicies = Object.keys(policyData)
        .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
        .map(key => policyData[key])
        .filter(p => p.hasMedical)
        .sort((a, b) => b.medicalScore - a.medicalScore);
    
    const stabilityPolicies = Object.keys(policyData)
        .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
        .map(key => policyData[key])
        .sort((a, b) => a.sensitivity?.range - b.sensitivity?.range);
    
    const overallPolicies = Object.keys(policyData)
        .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
        .map(key => policyData[key])
        .sort((a, b) => b.overallScore - a.overallScore);
    
    // 更新最佳 IRR 標籤
    const bestIRRBadge = document.getElementById('bestIRRBadge');
    if (bestIRRBadge && irrPolicies.length > 0) {
        bestIRRBadge.innerHTML = `<i class="fas fa-trophy me-1"></i>${irrPolicies[0].name} - 最佳 IRR ${(irrPolicies[0].irr * 100).toFixed(2)}%`;
    }
    
    // 更新最高報酬標籤
    const bestReturnBadge = document.getElementById('bestReturnBadge');
    if (bestReturnBadge && returnPolicies.length > 0) {
        bestReturnBadge.innerHTML = `<i class="fas fa-medal me-1"></i>${returnPolicies[0].name} - 最高報酬 ${returnPolicies[0].returnRate.toFixed(2)}%`;
    }
    
    // 更新最佳醫療標籤
    const bestMedicalBadge = document.getElementById('bestMedicalBadge');
    if (bestMedicalBadge && medicalPolicies.length > 0) {
        bestMedicalBadge.innerHTML = `<i class="fas fa-star me-1"></i>${medicalPolicies[0].name} - 最佳醫療保障 `;
    }
    
    // 更新最穩定標籤
    const leastSensitiveBadge = document.getElementById('leastSensitiveBadge');
    if (leastSensitiveBadge && stabilityPolicies.length > 0) {
        leastSensitiveBadge.innerHTML = `<i class="fas fa-shield-alt me-1"></i>${stabilityPolicies[0].name} - 最穩定產品 `;
    }
    
    // 更新綜合最佳標籤
    const bestOverallBadge = document.getElementById('bestOverallBadge');
    if (bestOverallBadge && overallPolicies.length > 0) {
        bestOverallBadge.innerHTML = `<i class="fas fa-crown me-1"></i>${overallPolicies[0].name} - 綜合最佳產品 `;
    }
    
    console.log(" 獎章標記更新完成 ");
}

// 生成圖表
function renderCharts() {
    console.log(" 正在生成圖表 ...");
    
    try {
        // 檢查 Chart 是否可用
        if (typeof Chart === 'undefined') {
            console.error("Chart.js 未載入 ");
            return;
        }
        
        // 準備保單數據
        const policies = Object.keys(policyData)
            .filter(key => key !== 'currencyType' && key !== 'advancedOptions' && key !== 'clientData')
            .map(key => policyData[key]);
            
        // 如果沒有保單數據，直接返回
        if (policies.length === 0) {
            console.log(" 沒有保單數據，不生成圖表 ");
            return;
        }
        
        // 檢測是否為 iPad 橫向模式
        const isIPadLandscape = isIPadLandscapeMode();
        
        // 更新圖表容器佈局
        adjustChartContainers(isIPadLandscape);
        
        // 定義彩色螢光色彩組合
        const glowColors = [
            { bg: 'rgba(0, 229, 255, 0.7)', border: 'rgba(0, 229, 255, 1)' }, // 藍色
            { bg: 'rgba(0, 255, 157, 0.7)', border: 'rgba(0, 255, 157, 1)' }, // 綠色
            { bg: 'rgba(255, 214, 0, 0.7)', border: 'rgba(255, 214, 0, 1)' }, // 黃色
            { bg: 'rgba(255, 82, 171, 0.7)', border: 'rgba(255, 82, 171, 1)' }, // 粉色
            { bg: 'rgba(155, 89, 255, 0.7)', border: 'rgba(155, 89, 255, 1)' }  // 紫色
        ];
        
        // IRR 條形圖
        const irrCtx = document.getElementById('irrChart');
        if (irrCtx) {
            // 如果已經有圖表實例，先銷毀它
            if (window.irrChartInstance) {
                window.irrChartInstance.destroy();
            }
            
            window.irrChartInstance = new Chart(irrCtx, {
                type: 'bar',
                data: {
                    labels: policies.map(p => p.name),
                    datasets: [{
                        label: ' 年化報酬率 (%)',
                        data: policies.map(p => (p.irr * 100).toFixed(2)),
                        backgroundColor: policies.map((_, i) => glowColors[i % glowColors.length].bg),
                        borderColor: policies.map((_, i) => glowColors[i % glowColors.length].border),
                        borderWidth: 1,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `IRR: ${context.raw}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: ' 年化報酬率 (%)',
                                color: 'rgba(255, 255, 255, 0.8)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
        
        // 醫療評分圖表
        const medicalCtx = document.getElementById('medicalChart');
        if (medicalCtx) {
            if (window.medicalChartInstance) {
                window.medicalChartInstance.destroy();
            }
            
            window.medicalChartInstance = new Chart(medicalCtx, {
                type: 'polarArea',
                data: {
                    labels: policies.map(p => p.name),
                    datasets: [{
                        data: policies.map(p => p.medicalScore),
                        backgroundColor: policies.map((p, i) => 
                            `rgba(${30 + i * 50}, ${100 + i * 40}, 255, 0.7)`
                        )
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
        
        // 雷達圖
        const radarCtx = document.getElementById('radarChart');
        if (radarCtx) {
            if (window.radarChartInstance) {
                window.radarChartInstance.destroy();
            }
            
            window.radarChartInstance = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: [' 報酬率 ', ' 年化報酬率 ', ' 醫療保障 ', ' 穩定性 ', ' 成本效益 '],
                    datasets: policies.map((policy, i) => {
                        return {
                            label: policy.name,
                            data: [
                                policy.returnRate / 2, // 報酬率 ( 標準化 )
                                policy.irr * 1000, // 年化報酬率 ( 標準化 )
                                policy.medicalScore,
                                10 - (policy.sensitivity?.range || 0) * 100, // 穩定性 ( 反向 )
                                policy.surrender / policy.totalPremium * 5 // 成本效益
                            ],
                            backgroundColor: `rgba(${30 + i * 50}, ${100 + i * 40}, 255, 0.2)`,
                            borderColor: `rgba(${30 + i * 50}, ${100 + i * 40}, 255, 0.8)`,
                        };
                    })
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            min: 0,
                            max: 10
                        }
                    }
                }
            });
        }
        
        // 綜合評分圖表
        const overallCtx = document.getElementById('overallChart');
        if (overallCtx) {
            if (window.overallChartInstance) {
                window.overallChartInstance.destroy();
            }
            
            window.overallChartInstance = new Chart(overallCtx, {
                type: 'bar',
                data: {
                    labels: policies.map(p => p.name),
                    datasets: [
                        {
                            label: ' 報酬評分 ',
                            data: policies.map(p => p.returnScore),
                            backgroundColor: 'rgba(0, 229, 255, 0.7)'
                        },
                        {
                            label: ' 醫療評分 ',
                            data: policies.map(p => p.medicalScore),
                            backgroundColor: 'rgba(0, 255, 157, 0.7)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10
                        }
                    }
                }
            });
        }
        
        // 圖表渲染完成後調整大小
        setTimeout(() => {
            resizeAllCharts();
        }, 100);
        
        console.log(" 圖表生成完成 ");
    } catch (error) {
        console.error(" 生成圖表時出錯 :", error);
    }
}

// 檢測是否為 iPad 橫向模式
function isIPadLandscapeMode() {
    const isIPad = /iPad/.test(navigator.userAgent) || 
                   (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
    
    return isIPad && window.innerWidth > window.innerHeight;
}

// 調整圖表容器佈局，適應橫向 / 縱向模式
function adjustChartContainers(isLandscape) {
    // 對比表面板佈局調整
    const comparisonRows = document.querySelectorAll('#comparison .row');
    comparisonRows.forEach(row => {
        if (isLandscape && row.querySelectorAll('.col-md-6').length === 2) {
            row.classList.add('landscape-chart-layout');
            row.classList.remove('row');
        } else if (!isLandscape && row.classList.contains('landscape-chart-layout')) {
            row.classList.remove('landscape-chart-layout');
            row.classList.add('row');
        }
    });
    
    // 報告面板佈局調整
    const reportRows = document.querySelectorAll('#report .row');
    reportRows.forEach(row => {
        if (isLandscape && row.querySelectorAll('.col-md-6').length === 2) {
            row.classList.add('report-landscape-layout');
            row.classList.remove('row');
        } else if (!isLandscape && row.classList.contains('report-landscape-layout')) {
            row.classList.remove('report-landscape-layout');
            row.classList.add('row');
        }
    });
}

// 重設所有圖表大小，確保在轉向後正確顯示
function resizeAllCharts() {
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
            window[instanceName].resize();
        }
    });
}

// 增強方向變化處理函數
function handleOrientationChange() {
    document.body.classList.add('orientation-change');
    const isLandscape = checkOrientation();
    
    // 顯示轉向提示
    showOrientationFeedback(isLandscape);
    
    // 修復頁籤切換問題
    fixTabSwitching();
    
    setTimeout(function() {
        document.body.classList.remove('orientation-change');
        
        // 重新佈局圖表
        adjustChartContainers(isLandscape);
        resizeAllCharts();
        
        console.log(" 方向變更處理完成 ");
    }, 500);
}

// 顯示轉向提示
function showOrientationFeedback(isLandscape) {
    const feedback = document.createElement('div');
    feedback.className = 'orientation-feedback';
    feedback.innerHTML = `<i class="fas fa-${isLandscape ? 'expand' : 'compress'}-alt"></i> 
                        ${isLandscape ? ' 橫向模式 ' : ' 縱向模式 '}`;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.classList.add('fade-out');
        setTimeout(() => {
            feedback.remove();
        }, 500);
    }, 1500);
}

// 修復頁籤切換問題
function fixTabSwitching() {
    // 獲取當前激活的頁籤
    const activeTab = document.querySelector('#analysisTab .nav-link.active');
    if (activeTab) {
        // 重新激活當前頁籤
        setTimeout(() => {
            activeTab.click();
        }, 50);
    }
}

// 生成報告
function generateReport() {
    console.log(" 生成報告 ...");
    
    try {
        // 當前日期
        document.getElementById('reportDate').textContent = new Date().toLocaleDateString('zh-TW');
        
        // 貨幣類型
        document.getElementById('reportCurrency').textContent = 
            policyData.currencyType === 'USD' ? ' 美金 (USD)' : ' 台幣 (TWD)';
        
        // 最佳保單信息
        const bestPolicy = findBestPolicy();
        document.getElementById('bestPolicyName').textContent = bestPolicy.name;
        document.getElementById('bestPolicyScore').textContent = bestPolicy.overallScore.toFixed(1);
        document.getElementById('bestPolicyIRR').textContent = (bestPolicy.irr * 100).toFixed(2) + "%";
        document.getElementById('bestPolicyDividend').textContent = bestPolicy.dividend.toFixed(2) + "%";
        
        // 更新推薦內容
        const recommendationText = `
            根據您的需求分析，${bestPolicy.name} 在綜合評分中表現最佳，總評分為 ${bestPolicy.overallScore.toFixed(1)} 分。
            此保單提供 ${bestPolicy.dividend.toFixed(2)}% 的年配息率，年化報酬率 (IRR) 為 ${(bestPolicy.irr * 100).toFixed(2)}%，
            醫療保障得分為 ${bestPolicy.medicalScore.toFixed(1)} 分。
            其中配息收益佔總報酬的 ${bestPolicy.dividendRatio.toFixed(1)}%，提供穩定的現金流。
            建議您考慮選擇此產品，以獲得良好的保障和投資回報。
        `;
        document.getElementById('reportRecommendation').innerHTML = `
            <h5 class="tech-bright-text"> 專業建議 :</h5>
            <p>${recommendationText}</p>
        `;
        
        // 渲染報告圖表
        renderReportChart();
        
        // 更新詳細比較表
        updateReportDetailTable();
        
        // 啟用報告頁籤
        const reportTab = document.getElementById('report-tab');
        reportTab.disabled = false;
        reportTab.classList.add('unlocked');
        
        // 切換到報告頁籤
        switchTab('report');
    } catch (error) {
        console.error(" 生成報告時出錯 :", error);
    }
}

// 渲染報告圖表，包含配息分析
function renderReportChart() {
    const ctx = document.getElementById('reportComparisonChart');
    if (!ctx) return;
    
    // 獲取要顯示的保單
    const policies = getFilteredPolicies(false, showMarketComparison);
    
    if (window.reportChartInstance) {
        window.reportChartInstance.destroy();
    }
    
    window.reportChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [' 年化報酬率 ', ' 配息收益 ', ' 醫療保障 ', ' 穩定性 ', ' 綜合表現 '],
            datasets: policies.map((policy, i) => {
                return {
                    label: policy.name,
                    data: [
                        policy.irr * 500,         // 年化報酬率 ( 標準化 )
                        policy.dividend,          // 配息 ( 已經是百分比 )
                        policy.medicalScore,      // 醫療保障
                        10 - (policy.sensitivity?.range || 0) * 100, // 穩定性 ( 反向 )
                        policy.overallScore       // 綜合表現
                    ],
                    backgroundColor: policy.name === policyData.own.name ? 
                        'rgba(0, 229, 255, 0.2)' : 
                        `rgba(${30 + i * 50}, ${100 + i * 40}, 255, 0.2)`,
                    borderColor: policy.name === policyData.own.name ? 
                        'rgba(0, 229, 255, 0.8)' : 
                        `rgba(${30 + i * 50}, ${100 + i * 40}, 255, 0.8)`,
                }
            })
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    min: 0,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    }
                }
            }
        }
    });
}

// 更新報告詳細表格，包含配息信息
function updateReportDetailTable() {
    const table = document.getElementById('reportDetailTable');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // 獲取要顯示的保單
    const policies = getFilteredPolicies(false, showMarketComparison);
    
    const currencySymbol = policyData.currencyType === 'USD' ? '$' : 'NT$';
    
    policies.forEach(policy => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${policy.name}</td>
            <td>${currencySymbol}${policy.premium.toLocaleString()}</td>
            <td>${policy.rate.toFixed(2)}%</td>
            <td>${policy.dividend.toFixed(2)}%</td>
            <td>${currencySymbol}${policy.surrender.toLocaleString()}</td>
            <td>${(policy.irr * 100).toFixed(2)}%</td>
            <td>${policy.medicalScore.toFixed(1)}</td>
            <td>${policy.overallScore.toFixed(1)}</td>
        `;
        
        // 使最佳保單行突出顯示
        if (policy.overallScore === Math.max(...policies.map(p => p.overallScore))) {
            row.classList.add('table-primary');
        }
        
        tbody.appendChild(row);
    });
}

// 設置比較顯示控制
function setupComparisonControls() {
    // 獲取控制元素
    const showOwnOnlyCheckbox = document.getElementById('showOwnOnly');
    const showMarketComparisonCheckbox = document.getElementById('showMarketComparison');
    
    // 初始設置
    showMarketComparison = false;

    // 監聽選擇變更
    if (showOwnOnlyCheckbox && showMarketComparisonCheckbox) {
        showOwnOnlyCheckbox.addEventListener('change', function() {
            const showOnlyOwn = this.checked;
            updateDisplayedPolicies(showOnlyOwn, showMarketComparison);
        });
        
        showMarketComparisonCheckbox.addEventListener('change', function() {
            showMarketComparison = this.checked;
            updateDisplayedPolicies(showOwnOnlyCheckbox.checked, showMarketComparison);
        });
    }
    
    // 初始更新顯示
    updateDisplayedPolicies(true, false);
}

// 更新顯示的保單
function updateDisplayedPolicies(showOnlyOwn, includeMarket) {
    console.log(" 更新顯示的保單 :", {showOnlyOwn, includeMarket});
    
    // 根據選擇獲取要顯示的保單
    const policiesToShow = getFilteredPolicies(showOnlyOwn, includeMarket);
    
    // 重新渲染所有圖表和表格
    updateComparisonTables();
    updateDividendAnalysis();
    updateMedicalAnalysis();
    updateComprehensiveAnalysis();
    renderCharts();
}

// 根據選擇獲取要顯示的保單
function getFilteredPolicies(showOnlyOwn, includeMarket) {
    const policies = [];
    
    // 始終包含自家保單
    policies.push(policyData.own);
    
    // 如果不僅顯示自家保單，則添加競品
    if (!showOnlyOwn) {
        if (policyData.compA) policies.push(policyData.compA);
        if (policyData.compB) policies.push(policyData.compB);
        if (policyData.compC) policies.push(policyData.compC);
    }
    
    // 如果包含市場比較，則添加市場數據
    if (includeMarket) {
        if (policyData.marketAverage) policies.push(policyData.marketAverage);
        if (policyData.marketPremium) policies.push(policyData.marketPremium);
    }
    
    return policies;
}

// 修改模組切換函數，提供更好的視覺化提示
function handleModuleChange(module) {
    // 重置模組內容區域顯示狀態
    document.getElementById('input').classList.remove('show', 'active');
    
    // 將選中的按鈕設為 active
    document.querySelectorAll('.btn-nav').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.btn-nav[data-module="${module}"]`).classList.add('active');
    
    if (module === 'basic') {
        // 顯示基本分析模組的內容
        document.getElementById('input').classList.add('show', 'active');
        updateAiMessage(" 基本分析模式下，您可以輸入自家保單數據進行分析比較，競品數據為選填項目。系統會自動產生市場參考數據進行比較。");
    } else {
        // 為其他模組顯示更優化的「即將推出」提示
        showEnhancedComingSoonModal(module);
    }
}

// 新增：優化的功能即將推出模態視窗
function showEnhancedComingSoonModal(module) {
    const moduleNames = {
        'retirement': ' 退休規劃 ',
        'portfolio': ' 資產配置 ',
        'market': ' 市場數據 '
    };
    
    const moduleName = moduleNames[module] || module;
    const moduleDescriptions = {
        'retirement': ' 退休金缺口分析、儲蓄險年金化選項評估、退休收入試算 ',
        'portfolio': ' 資產配置建議、多保單組合分析、風險與報酬平衡評估 ',
        'market': ' 市場利率趨勢分析、同業產品比較、保險公司財務指標評估 '
    };
    
    const moduleDesc = moduleDescriptions[module] || ' 進階功能評估與比較 ';
    
    // 創建一個更吸引人的模態彈窗
    const modalHTML = `
    <div class="modal fade" id="enhancedComingSoonModal" tabindex="-1" aria-labelledby="enhancedComingSoonModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content" style="background-color: rgba(6, 28, 56, 0.95); border: 2px solid rgba(0, 229, 255, 0.7);">
                <div class="modal-header" style="border-bottom: 2px solid rgba(0, 229, 255, 0.5);">
                    <h4 class="modal-title tech-highlight-text" id="enhancedComingSoonModalLabel">
                        <i class="fas fa-rocket me-2"></i>${moduleName} - 功能開發中
                    </h4>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4 text-center mb-3">
                            <i class="fas fa-cogs" style="font-size: 80px; color: #00ffff; text-shadow: 0 0 30px rgba(0, 255, 255, 0.8);"></i>
                        </div>
                        <div class="col-md-8">
                            <h5 class="tech-bright-text"> 即將推出的功能 </h5>
                            <p class="tech-bright-text">${moduleDesc}</p>
                            <div class="alert" style="background-color: rgba(0, 229, 255, 0.2); border: 1px solid rgba(0, 229, 255, 0.5);">
                                <i class="fas fa-lightbulb me-2"></i> 我們正在開發更完整的 ${moduleName} 功能，預計將於下一版本推出！
                            </div>
                        </div>
                    </div>
                    
                    <div class="progress mt-4 mb-3" style="height: 20px; background-color: rgba(255, 255, 255, 0.1);">
                        <div class="progress-bar progress-bar-striped progress-bar-animated"
                             role="progressbar" style="width: 75%; background: linear-gradient(90deg, rgba(0, 229, 255, 0.8), rgba(0, 255, 157, 0.8));"
                             aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"> 開發進度： 75%</div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <div class="card h-100" style="background-color: rgba(0, 30, 60, 0.5); border: 1px solid rgba(0, 229, 255, 0.3);">
                                <div class="card-body">
                                    <h6 class="tech-bright-text"><i class="fas fa-calendar-check me-2"></i> 預計上線時間 </h6>
                                    <p class="tech-bright-text">2023 年第 4 季 </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100" style="background-color: rgba(0, 30, 60, 0.5); border: 1px solid rgba(0, 229, 255, 0.3);">
                                <div class="card-body">
                                    <h6 class="tech-bright-text"><i class="fas fa-bell me-2"></i> 功能通知 </h6>
                                    <p class="tech-bright-text"> 完成後我們將通知您！</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 2px solid rgba(0, 229, 255, 0.5);">
                    <button type="button" class="btn" style="background: linear-gradient(90deg, rgba(0, 229, 255, 0.5), rgba(0, 255, 157, 0.5)); border: none;" data-bs-dismiss="modal" id="backToBasicBtn">
                        <i class="fas fa-calculator me-2"></i> 返回基本分析
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // 移除先前存在的模態彈窗
    const oldModal = document.getElementById('enhancedComingSoonModal');
    if (oldModal) {
        oldModal.remove();
    }
    
    // 添加新模態彈窗到 DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 顯示模態彈窗
    const modal = new bootstrap.Modal(document.getElementById('enhancedComingSoonModal'));
    modal.show();
    
    // 當模態彈窗關閉時自動切換回基本分析模組
    document.getElementById('enhancedComingSoonModal').addEventListener('hidden.bs.modal', function () {
        currentModule = 'basic';
        document.querySelector('.btn-nav[data-module="basic"]').click();
    });
    
    // 返回基本分析按鈕事件
    document.getElementById('backToBasicBtn').addEventListener('click', function() {
        currentModule = 'basic';
        document.querySelector('.btn-nav[data-module="basic"]').click();
    });
    
    // 更新 AI 訊息
    updateAiMessage(`${moduleName} 功能即將在下一版本推出！目前您可以使用基本分析功能進行保單評估。`);
}

// 初始化動態背景效果
function initDynamicEffects() {
    // 創建隨機數據點
    createRandomDataPoints();
    
    // 添加閃爍效果
    setInterval(() => {
        const elements = document.querySelectorAll('.tech-frame, .tech-border-glow');
        elements.forEach(el => {
            if (Math.random() > 0.7) {
                el.style.opacity = (Math.random() * 0.5 + 0.5).toString();
            }
        });
    }, 1000);
    
    // 掃描線效果
    animateScanLine();
    
    // 為功能按鈕添加脈動效果
    document.querySelectorAll('.btn-nav').forEach(btn => {
        if (btn.getAttribute('data-module') !== 'basic') {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.add('pulse-icon');
                btn.style.position = 'relative';
            }
        }
    });
    
    // 添加滾動特效
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        // 背景視差效果
        const techGrid = document.querySelector('.tech-grid');
        if (techGrid) {
            techGrid.style.transform = `translateY(${scrollY * 0.05}px)`;
        }
        
        const techLines = document.querySelector('.tech-lines');
        if (techLines) {
            techLines.style.transform = `translateY(${scrollY * 0.02}px)`;
        }
    });
    
    // 每隔一段時間重新創建掃描線
    setInterval(() => {
        refreshScanLine();
    }, 5000);
}

// 創建隨機數據點
function createRandomDataPoints() {
    const container = document.querySelector('.main-container');
    if (!container) return;
    
    // 清除舊的數據點
    const oldPoints = document.querySelectorAll('.random-data-point');
    oldPoints.forEach(point => point.remove());
    
    // 創建新的數據點
    const pointCount = 8 + Math.floor(Math.random() * 7); // 8-15 個點
    
    for (let i = 0; i < pointCount; i++) {
        const point = document.createElement('div');
        point.className = 'data-point random-data-point';
        point.style.top = `${5 + Math.random() * 90}%`;
        point.style.left = `${5 + Math.random() * 90}%`;
        point.style.animationDelay = `${Math.random() * 2}s`;
        point.style.zIndex = '1';
        container.appendChild(point);
    }
}

// 掃描線動畫
function animateScanLine() {
    const scanLine = document.querySelector('.scan-effect');
    if (!scanLine) {
        const newScanLine = document.createElement('div');
        newScanLine.className = 'scan-effect';
        document.body.appendChild(newScanLine);
    }
}

// 刷新掃描線
function refreshScanLine() {
    const oldScanLine = document.querySelector('.scan-effect');
    if (oldScanLine) {
        oldScanLine.remove();
    }
    
    // 短暫延遲後重新創建
    setTimeout(animateScanLine, 200);
}

// 添加計算按鈕的事件監聽器和其他初始化代碼

// 在 DOMContentLoaded 事件中添加按鈕的事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 載入完成，初始化事件監聽器 ...");
    
    try {
        // 為計算分析按鈕添加點擊事件
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            console.log(" 找到計算按鈕，添加事件監聽器 ");
            calculateBtn.addEventListener('click', function() {
                console.log(" 計算按鈕被點擊 ");
                calculateAndCompare();
            });
        } else {
            console.error(" 未找到計算按鈕元素 'calculateBtn'");
        }
        
        // 初始化模組切換按鈕
        const moduleButtons = document.querySelectorAll('.btn-nav');
        moduleButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const module = this.getAttribute('data-module');
                handleModuleChange(module);
            });
        });
        
        // 初始化返回按鈕
        const backToInputBtn = document.getElementById('backToInput');
        if (backToInputBtn) {
            backToInputBtn.addEventListener('click', function() {
                switchTab('input');
            });
        }
        
        const backToComparisonBtn = document.getElementById('backToComparison');
        if (backToComparisonBtn) {
            backToComparisonBtn.addEventListener('click', function() {
                switchTab('comparison');
            });
        }
        
        // 初始化報告生成按鈕
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', function() {
                generateReport();
                switchTab('report');
            });
        }
        
        // 初始化打印報告按鈕
        const printReportBtn = document.getElementById('printReportBtn');
        if (printReportBtn) {
            printReportBtn.addEventListener('click', function() {
                window.print();
            });
        }
        
        // 初始化高級選項面板切換
        const toggleAdvancedOptions = document.getElementById('toggleAdvancedOptions');
        const advancedOptionsPanel = document.getElementById('advancedOptionsPanel');
        if (toggleAdvancedOptions && advancedOptionsPanel) {
            toggleAdvancedOptions.addEventListener('click', function() {
                if (advancedOptionsPanel.style.display === 'none') {
                    advancedOptionsPanel.style.display = 'block';
                    toggleAdvancedOptions.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
                } else {
                    advancedOptionsPanel.style.display = 'none';
                    toggleAdvancedOptions.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });
        }
        
        // 初始化客戶分析面板切換
        const toggleClientAnalysis = document.getElementById('toggleClientAnalysis');
        const clientAnalysisPanel = document.getElementById('clientAnalysisPanel');
        if (toggleClientAnalysis && clientAnalysisPanel) {
            toggleClientAnalysis.addEventListener('click', function() {
                if (clientAnalysisPanel.style.display === 'none') {
                    clientAnalysisPanel.style.display = 'block';
                    toggleClientAnalysis.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
                } else {
                    clientAnalysisPanel.style.display = 'none';
                    toggleClientAnalysis.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });
        }
        
        // 初始化動態背景效果
        initDynamicEffects();
        
        console.log(" 所有事件監聽器初始化完成 ");
    } catch (error) {
        console.error(" 初始化事件監聽器時出錯 :", error);
        alert(" 初始化過程中出錯 : " + error.message);
    }
});

// 頁籤切換函數 - 修正滾輪問題版本
function switchTab(tabId) {
    console.log(` 切換到頁籤 : ${tabId}`);
    
    // 移除所有頁籤的活動狀態
    document.querySelectorAll('#analysisTab .nav-link').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    // 移除所有內容面板的活動狀態
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
    });
    
    // 激活目標頁籤
    const targetTab = document.getElementById(`${tabId}-tab`);
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
    }
    
    // 顯示目標內容並重置滾動位置
    const targetPane = document.getElementById(tabId);
    if (targetPane) {
        targetPane.classList.add('show', 'active');
        targetPane.scrollTop = 0; // 重置滾動位置
    }
    
    // 更新進度條
    updateProgressBar(tabId);
}

// 更新進度條
function updateProgressBar(tabId) {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        let progress = 33;
        let step = " 步驟 1/3";
        
        if (tabId === 'comparison') {
            progress = 66;
            step = " 步驟 2/3";
        } else if (tabId === 'report') {
            progress = 100;
            step = " 步驟 3/3";
        }
        
        // 添加動畫效果
        progressBar.style.transition = "width 0.8s ease";
        setTimeout(() => {
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
            progressBar.textContent = step;
        }, 100);
    }
}

// 返回上一頁函數
function goBack(fromTab) {
    if (fromTab === 'comparison') {
        switchTab('input');
    } else if (fromTab === 'report') {
        switchTab('comparison');
    }
}

// 顯示載入動畫
function showLoading() {
    // 添加載入動畫的實現，例如顯示一個加載器
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '9999';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border text-info';
    spinner.style.width = '4rem';
    spinner.style.height = '4rem';
    spinner.style.borderWidth = '0.5em';
    spinner.setAttribute('role', 'status');
    
    const spinnerText = document.createElement('span');
    spinnerText.className = 'sr-only';
    spinnerText.textContent = ' 計算中 ...';
    spinner.appendChild(spinnerText);
    
    loadingOverlay.appendChild(spinner);
    document.body.appendChild(loadingOverlay);
}

// 隱藏載入動畫
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// 更新 AI 訊息
function updateAiMessage(message) {
    const aiSuggestion = document.getElementById('aiSuggestion');
    if (aiSuggestion) {
        aiSuggestion.textContent = '';
        
        // 添加打字機效果
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < message.length) {
                aiSuggestion.textContent += message.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 30);
    }
}

// 添加事件監聽器
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 載入完成，初始化事件監聽器 ...");
    
    try {
        // 初始化市場比較控制
        const showOwnOnlyCheckbox = document.getElementById('showOwnOnly');
        const showMarketComparisonCheckbox = document.getElementById('showMarketComparison');
        
        if (showOwnOnlyCheckbox && showMarketComparisonCheckbox) {
            // 初始狀態
            showOwnOnlyCheckbox.checked = true;
            showMarketComparisonCheckbox.checked = false;
            
            // 添加事件監聽器
            showOwnOnlyCheckbox.addEventListener('change', function() {
                const showOnlyOwn = this.checked;
                updateDisplayedPolicies(showOnlyOwn, showMarketComparison);
            });
            
            showMarketComparisonCheckbox.addEventListener('change', function() {
                showMarketComparison = this.checked;
                updateDisplayedPolicies(showOwnOnlyCheckbox.checked, showMarketComparison);
            });
        }
        
        // 為計算分析按鈕添加點擊事件
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            console.log(" 找到計算按鈕，添加事件監聽器 ");
            calculateBtn.addEventListener('click', function() {
                console.log(" 計算按鈕被點擊 ");
                calculateAndCompare();
            });
        }
        
        // 初始化返回按鈕
        const backToInputBtn = document.getElementById('backToInput');
        if (backToInputBtn) {
            backToInputBtn.addEventListener('click', function() {
                goBack('comparison');
            });
        }
        
        const backToComparisonBtn = document.getElementById('backToComparison');
        if (backToComparisonBtn) {
            backToComparisonBtn.addEventListener('click', function() {
                goBack('report');
            });
        }
        
        // 初始化報告生成按鈕
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', function() {
                generateReport();
            });
        }
        
        // ...existing code...
        
    } catch (error) {
        console.error(" 初始化事件監聽器時出錯 :", error);
    }
});

// 設備方向和響應式處理
function initOrientationHandling() {
    console.log(" 初始化設備方向處理 ...");
    
    // 監聽方向變化事件
    window.addEventListener('orientationchange', function() {
        console.log(' 方向已變更 ');
        handleOrientationChange();
    });
    
    // 也監聽 resize 事件，因為某些設備不觸發 orientationchange
    window.addEventListener('resize', debounce(function() {
        console.log(' 視窗大小已變更 ');
        if (isOrientationChange()) {
            handleOrientationChange();
        }
    }, 250));
    
    // 初始檢查
    checkOrientation();
}

// 防抖函數，避免 resize 事件頻繁觸發
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// 檢查當前方向
function checkOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    document.body.classList.toggle('landscape', isLandscape);
    document.body.classList.toggle('portrait', !isLandscape);
    
    console.log(` 目前方向 : ${isLandscape ? ' 橫向 ' : ' 縱向 '}`);
    updateLayoutForOrientation(isLandscape);
    
    return isLandscape;
}

// 檢查是否發生了方向變更
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

function isOrientationChange() {
    const wasLandscape = lastWidth > lastHeight;
    const isLandscape = window.innerWidth > window.innerHeight;
    
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;
    
    return wasLandscape !== isLandscape;
}

// 處理方向變更
function handleOrientationChange() {
    // 添加過渡動畫類別
    document.body.classList.add('orientation-change');
    
    // 標記當前方向
    const isLandscape = checkOrientation();
    
    // 觸發圖表重新渲染
    setTimeout(function() {
        // 移除動畫類別
        document.body.classList.remove('orientation-change');
        
        // 重新渲染圖表
        redrawAllCharts();
        
        // 更新布局
        updateLayoutForOrientation(isLandscape);
        
        console.log(" 方向變更處理完成 ");
    }, 300);
}

// 根據方向更新布局
function updateLayoutForOrientation(isLandscape) {
    // 重新安排某些區塊的布局
    const comparisonPanels = document.querySelectorAll('#comparison .panel');
    
    if (comparisonPanels.length > 0) {
        if (isLandscape) {
            // 橫向模式 - 優化圖表與表格布局
            document.querySelectorAll('.chart-container').forEach(container => {
                container.style.height = '350px';
            });
            
            // 添加橫向佈局類
            document.querySelectorAll('.row').forEach(row => {
                if (row.children.length >= 2) {
                    row.classList.add('landscape-row');
                }
            });
        } else {
            // 縱向模式 - 更緊湊的布局
            document.querySelectorAll('.chart-container').forEach(container => {
                container.style.height = '300px';
            });
            
            // 移除橫向佈局類
            document.querySelectorAll('.landscape-row').forEach(row => {
                row.classList.remove('landscape-row');
            });
        }
    }
}

// 重新渲染所有圖表
function redrawAllCharts() {
    console.log(" 重新渲染所有圖表 ");
    
    // 檢查並重繪每個圖表
    const chartInstances = [
        'irrChartInstance', 
        'dividendChartInstance', 
        'cumulativeDividendChartInstance',
        'medicalChartInstance',
        'radarChartInstance', 
        'reportChartInstance'
    ];
    
    chartInstances.forEach(instanceName => {
        if (window[instanceName]) {
            console.log(` 重新渲染 : ${instanceName}`);
            try {
                window[instanceName].resize();
                window[instanceName].update();
            } catch (error) {
                console.error(` 重繪 ${instanceName} 時出錯 :`, error);
            }
        }
    });
}

// iPad 專用佈局優化
function optimizeForIPad() {
    // 檢測是否為 iPad
    const isIPad = /iPad/.test(navigator.userAgent) || 
                  (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
    
    if (isIPad) {
        console.log(" 檢測到 iPad 設備，應用專用優化 ");
        document.body.classList.add('ipad-device');
        
        // 增強觸控體驗
        document.querySelectorAll('button, input, select, a').forEach(el => {
            el.style.touchAction = 'manipulation'; // 改善觸控響應
        });
        
        // 處理表格滾動
        document.querySelectorAll('.table-responsive').forEach(table => {
            table.style.webkitOverflowScrolling = 'touch';
        });
        
        // 調整部分元素大小以適應觸控
        document.querySelectorAll('.form-check-input').forEach(input => {
            input.style.width = '22px';
            input.style.height = '22px';
        });
    }
}

// 在文檔載入後初始化方向處理
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // 初始化方向處理
    initOrientationHandling();
    
    // 優化 iPad 體驗
    optimizeForIPad();
    
    // ...existing code...
});

// 擴展現有渲染函數以支持響應式調整

// 修改渲染圖表函數以支持方向變化
const originalRenderCharts = renderCharts;
renderCharts = function() {
    originalRenderCharts();
    
    // 檢查當前方向並進行相應調整
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // 為圖表適應方向
    const chartElements = document.querySelectorAll('.chart-container canvas');
    chartElements.forEach(canvas => {
        // 將 canvas 標記為需要適應方向
        canvas.setAttribute('data-orientation-aware', 'true');
    });
}

// 添加對滾輪事件的處理
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // 阻止滾輪事件導致頁面切換
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.addEventListener('wheel', function(e) {
            // 阻止事件冒泡到可能導致頁籤切換的父元素
            e.stopPropagation();
        });
    });
    
    // 確保頁籤切換只通過按鈕觸發
    document.querySelectorAll('.btn-nav, #analysisTab .nav-link, #backToInput, #backToComparison').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // 阻止點擊事件可能導致的頁面滾動
            e.preventDefault();
            
            // 其他原有處理邏輯 ...
            
            // 防止事件冒泡
            e.stopPropagation();
        });
    });
    
    // ...existing code...
});

// 修正 iOS 上的滾動問題
function fixIOSScrolling() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    if (isIOS) {
        document.querySelectorAll('.single-tab-content').forEach(tab => {
            // 修復 iOS 橡皮筋效果
            tab.addEventListener('touchmove', function(e) {
                const scrollTop = tab.scrollTop;
                const scrollHeight = tab.scrollHeight;
                const height = tab.clientHeight;
                
                if ((scrollTop <= 0 && e.touches[0].clientY > 0) || 
                    (scrollTop + height >= scrollHeight && e.touches[0].clientY < 0)) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
    }
}

// 在文檔加載後調用修復函數
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    fixIOSScrolling();
    // ...existing code...
});

// 完全重寫頁籤切換函數，解決 iPad 問題
function switchTab(tabId) {
    console.log(` 切換到頁籤 : ${tabId}`);
    
    // 獲取頁籤元素
    const targetTab = document.getElementById(`${tabId}-tab`);
    if (!targetTab || targetTab.hasAttribute('disabled')) {
        console.log(' 頁籤被禁用或不存在，無法切換 ');
        return;
    }
    
    // 手動處理頁籤切換邏輯
    const allTabs = document.querySelectorAll('#analysisTab .nav-link');
    const allPanes = document.querySelectorAll('.tab-pane');
    
    // 停用所有頁籤和面板
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    allPanes.forEach(pane => {
        pane.classList.remove('show', 'active');
    });
    
    // 激活目標頁籤和面板
    targetTab.classList.add('active');
    targetTab.setAttribute('aria-selected', 'true');
    
    const targetPane = document.getElementById(tabId);
    if (targetPane) {
        targetPane.classList.add('show', 'active');
        
        // 重置面板滾動位置
        setTimeout(() => {
            if (targetPane.scrollTo) {
                targetPane.scrollTo(0, 0);
            } else {
                targetPane.scrollTop = 0;
            }
        }, 50);
    }
    
    // 更新進度條
    updateProgressBar(tabId);
    
    // 在 iPad 上修復可能的滾動問題
    if (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
        // 防止整頁滾動
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

// 更新進度條，添加更好的視覺反饋
function updateProgressBar(tabId) {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        let progress = 33;
        let step = " 步驟 1/3";
        
        if (tabId === 'comparison') {
            progress = 66;
            step = " 步驟 2/3";
        } else if (tabId === 'report') {
            progress = 100;
            step = " 步驟 3/3";
        }
        
        // 強化過渡效果
        progressBar.style.transition = "width 0.8s cubic-bezier(0.22, 0.61, 0.36, 1), background-color 0.8s ease";
        
        // 顏色漸變效果
        const colors = ['rgba(0, 229, 255, 0.8)', 'rgba(0, 255, 157, 0.8)'];
        const gradient = `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
        progressBar.style.background = gradient;
        
        // 應用尺寸變化
        setTimeout(() => {
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
            progressBar.textContent = step;
            
            // 添加脈衝動畫效果
            progressBar.classList.add('pulse-animation');
            setTimeout(() => {
                progressBar.classList.remove('pulse-animation');
            }, 800);
        }, 50);
    }
}

// 初始化 iPad 專用優化
function initIPadOptimizations() {
    const isIPad = /iPad/.test(navigator.userAgent) || 
                   (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
    
    if (isIPad) {
        console.log(' 檢測到 iPad，應用專用優化 ');
        document.body.classList.add('ipad-device');
        
        // 強制頁面保持固定尺寸，防止橡皮筋效果
        document.documentElement.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // 處理全局滾動
        const container = document.querySelector('.dashboard-container');
        if (container) {
            container.style.height = '100%';
            container.style.overflowY = 'auto';
            container.style.overflowX = 'hidden';
            container.style.webkitOverflowScrolling = 'touch';
            
            // 防止過度滾動
            container.addEventListener('touchmove', function(e) {
                if (this.scrollTop <= 0 && e.touches[0].clientY > 0) {
                    e.preventDefault();
                }
                if (this.scrollTop + this.clientHeight >= this.scrollHeight && e.touches[0].clientY < 0) {
                    e.preventDefault();
                }
            }, { passive: false });
        }
        
        // 改善頁籤滾動體驗
        document.querySelectorAll('.single-tab-content').forEach(content => {
            // 防止 iOS 橡皮筋效果
            content.addEventListener('touchmove', function(e) {
                // 允許正常滾動，但阻止到達邊界時的過度滾動
                const scrollTop = this.scrollTop;
                const scrollHeight = this.scrollHeight;
                const height = this.clientHeight;
                
                if ((scrollTop <= 0 && e.touches[0].clientY > 0) || 
                    (scrollTop + height >= scrollHeight && e.touches[0].clientY < 0)) {
                    e.preventDefault();
                }
            }, { passive: false });
        });
        
        // 阻止所有可能導致頁籤切換問題的默認事件
        document.addEventListener('gesturestart', preventDefault, { passive: false });
        document.addEventListener('gesturechange', preventDefault, { passive: false });
    }
}

// 阻止默認事件助手函數
function preventDefault(e) {
    e.preventDefault();
}

// 在 DOM 載入後初始化
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    
    // 添加 iPad 優化初始化
    initIPadOptimizations();
    
    // 確保頁籤的點擊區域足夠大
    document.querySelectorAll('.nav-tabs .nav-link').forEach(tab => {
        tab.style.minHeight = '44px';
        tab.style.display = 'flex';
        tab.style.alignItems = 'center';
    });
    
    // 修復頁籤重新激活問題
    window.addEventListener('resize', debounce(function() {
        // 在調整大小後重新激活當前頁籤
        const activeTab = document.querySelector('#analysisTab .nav-link.active');
        if (activeTab) {
            const tabId = activeTab.id.replace('-tab', '');
            // 延遲以確保尺寸計算已完成
            setTimeout(() => {
                switchTab(tabId);
            }, 100);
        }
    }, 250));
    
    // ...existing code...
});

// 專門處理 iOS 旋轉問題的函數
function handleIOSOrientationChange() {
    // 添加遮罩以隱藏旋轉期間的視覺抖動
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.backgroundColor = '#040b19';
    mask.style.zIndex = '10000';
    mask.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(mask);
    
    // 延遲後重新激活頁籤和布局
    setTimeout(() => {
        // 獲取當前激活的頁籤
        const activeTab = document.querySelector('#analysisTab .nav-link.active');
        if (activeTab) {
            const tabId = activeTab.id.replace('-tab', '');
            switchTab(tabId);
        }
        
        // 重新渲染所有圖表
        redrawAllCharts();
        
        // 淡出遮罩
        mask.style.opacity = '0';
        setTimeout(() => {
            mask.remove();
        }, 500);
    }, 300);
}

// 檢測是否為 iPad
function isIPad() {
    return /iPad/.test(navigator.userAgent) || 
           (/Macintosh/i.test(navigator.platform) && navigator.maxTouchPoints > 1);
}

// 更新設備方向處理
window.addEventListener('orientationchange', function() {
    console.log(' 方向已變更 :', window.orientation);
    
    if (isIPad()) {
        handleIOSOrientationChange();
    } else {
        handleOrientationChange();
    }
});

// ...existing code...
