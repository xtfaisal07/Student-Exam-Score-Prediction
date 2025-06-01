// Application data
const algorithmsData = [
    {"name": "Linear Regression", "accuracy": 88.73, "r2_score": 0.85, "mae": 6.8, "rmse": 8.9},
    {"name": "Ridge Regression", "accuracy": 88.0, "r2_score": 0.86, "mae": 6.5, "rmse": 8.7},
    {"name": "Random Forest", "accuracy": 85.5, "r2_score": 0.75, "mae": 7.2, "rmse": 9.8},
    {"name": "Support Vector Regression", "accuracy": 86.0, "r2_score": 0.90, "mae": 6.02, "rmse": 8.59},
    {"name": "XGBoost", "accuracy": 82.4, "r2_score": 0.73, "mae": 7.5, "rmse": 10.2},
    {"name": "Decision Tree", "accuracy": 68.13, "r2_score": 0.66, "mae": 9.5, "rmse": 12.8}
];

const factorsData = [
    {"factor": "Study Hours", "correlation": 0.75, "impact": "High", "category": "Academic"},
    {"factor": "Previous Grades", "correlation": 0.89, "impact": "Very High", "category": "Academic"},
    {"factor": "Attendance Rate", "correlation": 0.68, "impact": "High", "category": "Academic"},
    {"factor": "Parental Education", "correlation": 0.45, "impact": "Medium", "category": "Family"},
    {"factor": "Family Support", "correlation": 0.52, "impact": "Medium", "category": "Family"},
    {"factor": "Socioeconomic Status", "correlation": 0.61, "impact": "High", "category": "Social"},
    {"factor": "Motivation Level", "correlation": 0.71, "impact": "High", "category": "Individual"},
    {"factor": "Mental Health", "correlation": 0.49, "impact": "Medium", "category": "Individual"}
];

const recommendations = {
    "high_risk": "Student may need additional support. Consider tutoring, study groups, or one-on-one mentoring.",
    "medium_risk": "Student shows moderate performance. Encourage consistent study habits and engagement.",
    "low_risk": "Student is performing well. Maintain current study patterns and consider advanced challenges."
};

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const studyHoursSlider = document.getElementById('study-hours');
const studyHoursValue = document.getElementById('study-hours-value');
const familySlider = document.getElementById('family-relationship');
const familyValue = document.getElementById('family-value');
const freetimeSlider = document.getElementById('freetime');
const freetimeValue = document.getElementById('freetime-value');
const predictionForm = document.getElementById('prediction-form');
const predictionResults = document.getElementById('prediction-results');
const predictedScore = document.getElementById('predicted-score');
const confidenceFill = document.getElementById('confidence-fill');
const confidenceValue = document.getElementById('confidence-value');
const recommendation = document.getElementById('recommendation');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeSliders();
    initializePredictionForm();
    populateAlgorithmTable();
    populateFactorAnalysis();
});

// Tab Navigation
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(targetTab) {
    // Remove active class from all tabs and panels
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    document.querySelector(`[data-tab="${targetTab}"]`).classList.add('active');
    document.getElementById(targetTab).classList.add('active');
}

// Slider Controls
function initializeSliders() {
    studyHoursSlider.addEventListener('input', function() {
        studyHoursValue.textContent = this.value;
    });
    
    familySlider.addEventListener('input', function() {
        familyValue.textContent = this.value;
    });
    
    freetimeSlider.addEventListener('input', function() {
        freetimeValue.textContent = this.value;
    });
}

// Prediction Form
function initializePredictionForm() {
    predictionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = collectFormData();
        const prediction = calculatePrediction(formData);
        displayPredictionResults(prediction);
    });
}

function collectFormData() {
    return {
        studyHours: parseInt(document.getElementById('study-hours').value),
        mathGrade: parseFloat(document.getElementById('math-grade').value),
        portugueseGrade: parseFloat(document.getElementById('portuguese-grade').value),
        failures: parseInt(document.getElementById('failures').value),
        familyRelationship: parseInt(document.getElementById('family-relationship').value),
        freetime: parseInt(document.getElementById('freetime').value),
        absences: parseInt(document.getElementById('absences').value),
        activities: document.getElementById('activities').checked,
        internet: document.getElementById('internet').checked,
        higherEd: document.getElementById('higher-ed').checked
    };
}

function calculatePrediction(data) {
    // Simplified prediction algorithm based on key factors
    let baseScore = 0;
    let confidence = 0;
    
    // Previous grades (highest weight - 40%)
    const avgPreviousGrade = (data.mathGrade + data.portugueseGrade) / 2;
    baseScore += avgPreviousGrade * 0.4;
    confidence += 30;
    
    // Study hours (25%)
    const studyHoursEffect = Math.min(data.studyHours * 2, 20) * 0.25;
    baseScore += studyHoursEffect;
    confidence += 20;
    
    // Attendance (negative impact from absences - 15%)
    const attendanceEffect = Math.max(0, (50 - data.absences) / 50) * 20 * 0.15;
    baseScore += attendanceEffect;
    confidence += 15;
    
    // Family and motivation factors (10%)
    const motivationEffect = (data.familyRelationship / 5) * 20 * 0.05;
    baseScore += motivationEffect;
    
    // Educational support factors (10%)
    let supportBonus = 0;
    if (data.activities) supportBonus += 1;
    if (data.internet) supportBonus += 1;
    if (data.higherEd) supportBonus += 2;
    baseScore += (supportBonus / 4) * 20 * 0.1;
    confidence += 15;
    
    // Failure penalty
    baseScore -= data.failures * 2;
    
    // Free time balance (too much or too little can be negative)
    const freetimeBalance = 1 - Math.abs(data.freetime - 3) / 3;
    baseScore += freetimeBalance * 1;
    confidence += 10;
    
    // Ensure score is within bounds
    const finalScore = Math.max(0, Math.min(20, baseScore));
    const finalConfidence = Math.max(60, Math.min(95, confidence));
    
    return {
        score: finalScore,
        confidence: finalConfidence
    };
}

function displayPredictionResults(prediction) {
    // Show results section
    predictionResults.classList.remove('hidden');
    
    // Animate score display
    animateScore(prediction.score);
    
    // Update confidence
    confidenceFill.style.width = `${prediction.confidence}%`;
    confidenceValue.textContent = `${Math.round(prediction.confidence)}%`;
    
    // Determine risk level and show recommendation
    let riskLevel, recommendationText, recommendationClass;
    
    if (prediction.score < 10) {
        riskLevel = 'high_risk';
        recommendationClass = 'high-risk';
        recommendationText = recommendations.high_risk;
    } else if (prediction.score < 14) {
        riskLevel = 'medium_risk';
        recommendationClass = 'medium-risk';
        recommendationText = recommendations.medium_risk;
    } else {
        riskLevel = 'low_risk';
        recommendationClass = 'low-risk';
        recommendationText = recommendations.low_risk;
    }
    
    recommendation.className = `recommendation ${recommendationClass}`;
    recommendation.textContent = recommendationText;
    
    // Scroll to results
    predictionResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function animateScore(targetScore) {
    let currentScore = 0;
    const increment = targetScore / 30;
    
    const animation = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(animation);
        }
        predictedScore.textContent = currentScore.toFixed(1);
    }, 50);
}

// Algorithm Table Population
function populateAlgorithmTable() {
    const tableBody = document.getElementById('algorithm-table-body');
    
    // Sort algorithms by R² score to highlight best performer
    const sortedAlgorithms = [...algorithmsData].sort((a, b) => b.r2_score - a.r2_score);
    
    sortedAlgorithms.forEach((algorithm, index) => {
        const row = document.createElement('tr');
        if (index === 0) {
            row.classList.add('best-algorithm');
        }
        
        row.innerHTML = `
            <td>${algorithm.name}</td>
            <td>${algorithm.accuracy.toFixed(2)}%</td>
            <td>${algorithm.r2_score.toFixed(3)}</td>
            <td>${algorithm.mae.toFixed(2)}</td>
            <td>${algorithm.rmse.toFixed(2)}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Factor Analysis Population
function populateFactorAnalysis() {
    const categories = {
        'Academic': document.getElementById('academic-factors'),
        'Family': document.getElementById('family-factors'),
        'Individual': document.getElementById('individual-factors'),
        'Social': document.getElementById('social-factors')
    };
    
    factorsData.forEach(factor => {
        const factorElement = createFactorElement(factor);
        const categoryContainer = categories[factor.category];
        if (categoryContainer) {
            categoryContainer.appendChild(factorElement);
        }
    });
}

function createFactorElement(factor) {
    const factorItem = document.createElement('div');
    factorItem.className = 'factor-item';
    
    const impactClass = factor.impact.toLowerCase().replace(' ', '-');
    
    factorItem.innerHTML = `
        <span class="factor-name">${factor.factor}</span>
        <span class="factor-impact ${impactClass}">${factor.impact}</span>
    `;
    
    return factorItem;
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    if (data.mathGrade < 0 || data.mathGrade > 20) {
        errors.push('Math grade must be between 0 and 20');
    }
    
    if (data.portugueseGrade < 0 || data.portugueseGrade > 20) {
        errors.push('Portuguese grade must be between 0 and 20');
    }
    
    if (data.absences < 0 || data.absences > 50) {
        errors.push('Absences must be between 0 and 50');
    }
    
    if (errors.length > 0) {
        alert('Please correct the following errors:\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

// Enhanced form submission with validation
document.getElementById('prediction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    
    if (validateForm(formData)) {
        const prediction = calculatePrediction(formData);
        displayPredictionResults(prediction);
    }
});

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function showLoadingState() {
    const predictBtn = document.querySelector('.predict-btn');
    const originalText = predictBtn.innerHTML;
    
    predictBtn.innerHTML = '<span class="btn-icon">⏳</span> Calculating...';
    predictBtn.disabled = true;
    
    setTimeout(() => {
        predictBtn.innerHTML = originalText;
        predictBtn.disabled = false;
    }, 1500);
}

// Enhanced prediction with loading state
predictionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = collectFormData();
    
    if (validateForm(formData)) {
        showLoadingState();
        
        setTimeout(() => {
            const prediction = calculatePrediction(formData);
            displayPredictionResults(prediction);
        }, 1500);
    }
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        // Enhanced tab navigation
        return;
    }
    
    if (e.key === 'Enter' && e.target.classList.contains('tab-btn')) {
        e.target.click();
    }
});

// Touch gestures for mobile (basic swipe navigation)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const activeTab = document.querySelector('.tab-btn.active');
        const tabBtnsArray = Array.from(tabBtns);
        const currentIndex = tabBtnsArray.indexOf(activeTab);
        
        if (diff > 0 && currentIndex < tabBtnsArray.length - 1) {
            // Swipe left - next tab
            tabBtnsArray[currentIndex + 1].click();
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - previous tab
            tabBtnsArray[currentIndex - 1].click();
        }
    }
}

// Performance optimization: Lazy load content
function lazyLoadContent() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load content when visible
                entry.target.classList.add('loaded');
            }
        });
    });
    
    document.querySelectorAll('.tab-panel').forEach(panel => {
        observer.observe(panel);
    });
}

// Initialize lazy loading
lazyLoadContent();