# 🎓 Student Exam Score Prediction

This project predicts students' exam scores using machine learning models based on study hours. It's a beginner-friendly application showcasing the use of supervised learning with linear regression.

## 🚀 Project Overview

The main goal is to predict the **score a student might achieve based on the number of hours studied**. This is a classic regression problem that demonstrates:

- Data preprocessing
- Linear regression model training
- Prediction on new data
- Data visualization

## 📁 Repository Structure

```
Student-Exam-Score-Prediction/
├── algorithm_performance_comparison.csv                  # Dataset used
├── student_performance_prediction.py         # Model training and visualization
├── student_performance_prediction.py        # Python script version of the notebook
├── algorithm_accuracy_comparison.png        # Algorithm Accuracy png
└── README.md               # Project documentation

```






## 📊 Dataset

The dataset contains two columns:

- `Hours`: Number of hours a student studies
- `Scores`: Percentage score obtained by the student

Sample:

| Hours | Scores |
| ----- | ------ |
| 2.5   | 21     |
| 5.1   | 47     |
| 3.2   | 27     |

## 🛠️ Technologies Used

- Python
- Pandas
- NumPy
- Matplotlib
- Scikit-learn

## 📈 Model Used

- **Linear Regression** from `sklearn.linear_model`

The model is trained and tested using an 80/20 split and evaluated using metrics like:

- Mean Absolute Error (MAE)
- Mean Squared Error (MSE)
- R² Score

## 🧪 How to Run

1. Clone the repo:

   ```bash
   git clone https://github.com/xtfaisal07/Student-Exam-Score-Prediction.git
   cd Student-Exam-Score-Prediction
   ```

2. Install the required packages:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the notebook or script:

   - Open `prediction.ipynb` in Jupyter Notebook
   - Or run the script:
     ```bash
     python student_score.py
     ```

## 📌 Results

The model shows a strong linear correlation between study hours and score. For example, a student studying 9.25 hours is predicted to score around **93.69%**.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## 🤝🏼 Author

**Faisal Naseer**\
🌐 [GitHub](https://github.com/xtfaisal07)\
📧 Reach me at: [xtfaisal07@gmail.com](mailto\:xtfaisal07@gmail.com)

---

*Feel free to fork or star this repo if you found it helpful!*

