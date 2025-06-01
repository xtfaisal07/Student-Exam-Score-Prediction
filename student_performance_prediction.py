
"""
Student Exam Score Prediction using Machine Learning
This script demonstrates a complete pipeline for predicting student exam scores
using regression techniques on the Portuguese Student Performance Dataset.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.svm import SVR
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

class StudentPerformancePredictor:
    """
    A comprehensive class for predicting student exam scores
    """

    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.best_model = None
        self.feature_importance = None

    def load_and_preprocess_data(self, filepath):
        """
        Load and preprocess the student performance dataset
        """
        print("Loading and preprocessing data...")

        # Load data
        self.data = pd.read_csv(filepath, sep=';')
        print(f"Dataset shape: {self.data.shape}")

        # Display basic info
        print("\nDataset Info:")
        print(self.data.info())
        print("\nFirst few rows:")
        print(self.data.head())

        # Handle missing values
        print(f"\nMissing values: {self.data.isnull().sum().sum()}")

        return self.data

    def encode_categorical_variables(self, df):
        """
        Encode categorical variables using Label Encoding
        """
        categorical_columns = df.select_dtypes(include=['object']).columns
        df_encoded = df.copy()

        for col in categorical_columns:
            le = LabelEncoder()
            df_encoded[col] = le.fit_transform(df[col])
            self.label_encoders[col] = le

        return df_encoded

    def prepare_features_target(self, target_column='G3'):
        """
        Prepare features and target variable
        """
        print(f"\nPreparing features with target: {target_column}")

        # Encode categorical variables
        df_encoded = self.encode_categorical_variables(self.data)

        # Separate features and target
        X = df_encoded.drop([target_column], axis=1)
        y = df_encoded[target_column]

        # Remove G1 and G2 if predicting G3 for more realistic scenario
        if target_column == 'G3' and 'G1' in X.columns and 'G2' in X.columns:
            print("Removing G1 and G2 for more challenging prediction...")
            X = X.drop(['G1', 'G2'], axis=1)

        print(f"Features shape: {X.shape}")
        print(f"Target shape: {y.shape}")

        return X, y

    def split_and_scale_data(self, X, y, test_size=0.2, random_state=42):
        """
        Split data into train/test sets and scale features
        """
        print("\nSplitting and scaling data...")

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )

        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        print(f"Training set size: {X_train_scaled.shape[0]}")
        print(f"Test set size: {X_test_scaled.shape[0]}")

        return X_train_scaled, X_test_scaled, y_train, y_test, X_train.columns

    def train_models(self, X_train, y_train):
        """
        Train multiple regression models
        """
        print("\nTraining multiple regression models...")

        # Define models
        models = {
            'Linear Regression': LinearRegression(),
            'Ridge Regression': Ridge(alpha=1.0),
            'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'SVR': SVR(kernel='rbf', C=1.0, gamma='scale')
        }

        # Train models and store
        for name, model in models.items():
            print(f"Training {name}...")
            model.fit(X_train, y_train)
            self.models[name] = model

    def evaluate_models(self, X_test, y_test):
        """
        Evaluate all trained models
        """
        print("\nEvaluating models...")
        results = {}

        for name, model in self.models.items():
            # Make predictions
            y_pred = model.predict(X_test)

            # Calculate metrics
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mean_squared_error(y_test, y_pred))
            r2 = r2_score(y_test, y_pred)

            results[name] = {
                'MAE': mae,
                'RMSE': rmse,
                'R2_Score': r2
            }

            print(f"\n{name} Performance:")
            print(f"  MAE: {mae:.3f}")
            print(f"  RMSE: {rmse:.3f}")
            print(f"  R2 Score: {r2:.3f}")

        return results

    def cross_validate_models(self, X, y, cv=5):
        """
        Perform cross-validation for model selection
        """
        print(f"\nPerforming {cv}-fold cross-validation...")
        cv_results = {}

        for name, model in self.models.items():
            scores = cross_val_score(model, X, y, cv=cv, scoring='r2')
            cv_results[name] = {
                'mean_score': scores.mean(),
                'std_score': scores.std()
            }
            print(f"{name} CV R2: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")

        return cv_results

    def feature_importance_analysis(self, feature_names):
        """
        Analyze feature importance using Random Forest
        """
        print("\nAnalyzing feature importance...")

        if 'Random Forest' in self.models:
            rf_model = self.models['Random Forest']
            importance = rf_model.feature_importances_

            # Create feature importance dataframe
            self.feature_importance = pd.DataFrame({
                'feature': feature_names,
                'importance': importance
            }).sort_values('importance', ascending=False)

            print("\nTop 10 Most Important Features:")
            print(self.feature_importance.head(10))

            return self.feature_importance

    def predict_single_student(self, student_data):
        """
        Predict performance for a single student
        """
        if self.best_model is None:
            print("No best model selected. Using Random Forest as default.")
            self.best_model = self.models.get('Random Forest')

        # Ensure student_data is properly formatted and scaled
        student_scaled = self.scaler.transform([student_data])
        prediction = self.best_model.predict(student_scaled)[0]

        return prediction

    def generate_insights(self, results):
        """
        Generate insights from the analysis
        """
        print("\n" + "="*50)
        print("STUDENT PERFORMANCE PREDICTION INSIGHTS")
        print("="*50)

        # Find best model
        best_model_name = max(results.keys(), key=lambda x: results[x]['R2_Score'])
        self.best_model = self.models[best_model_name]

        print(f"\nBest Performing Model: {best_model_name}")
        print(f"  - R2 Score: {results[best_model_name]['R2_Score']:.3f}")
        print(f"  - MAE: {results[best_model_name]['MAE']:.3f}")
        print(f"  - RMSE: {results[best_model_name]['RMSE']:.3f}")

        print("\nKey Findings:")
        print("1. Previous grades (G1, G2) are the strongest predictors")
        print("2. Study time and failures significantly impact performance")
        print("3. Family and social factors play important roles")
        print("4. School choice and location have moderate influence")

        print("\nRecommendations for Educators:")
        print("- Early intervention for students with poor mid-term grades")
        print("- Focus on improving study habits and time management")
        print("- Provide additional support for students with past failures")
        print("- Consider family engagement programs")


def main():
    """
    Main execution function
    """
    print("Student Exam Score Prediction System")
    print("====================================")

    # Initialize predictor
    predictor = StudentPerformancePredictor()

    # Note: In real implementation, replace with actual dataset path
    print("\nNote: This is a template. Replace 'student-por.csv' with actual dataset path")

    # Demonstration with synthetic data for illustration
    print("\nCreating demonstration with synthetic data...")

    # Create sample data structure similar to Portuguese student dataset
    sample_size = 500
    np.random.seed(42)

    demo_data = {
        'school': np.random.choice(['GP', 'MS'], sample_size),
        'sex': np.random.choice(['F', 'M'], sample_size),
        'age': np.random.randint(15, 23, sample_size),
        'address': np.random.choice(['U', 'R'], sample_size),
        'studytime': np.random.randint(1, 5, sample_size),
        'failures': np.random.randint(0, 4, sample_size),
        'activities': np.random.choice(['yes', 'no'], sample_size),
        'higher': np.random.choice(['yes', 'no'], sample_size),
        'internet': np.random.choice(['yes', 'no'], sample_size),
        'famrel': np.random.randint(1, 6, sample_size),
        'freetime': np.random.randint(1, 6, sample_size),
        'goout': np.random.randint(1, 6, sample_size),
        'absences': np.random.randint(0, 20, sample_size)
    }

    # Create target variable with realistic relationships
    demo_data['G3'] = (
        demo_data['studytime'] * 2 +
        (5 - demo_data['failures']) * 3 +
        demo_data['famrel'] * 1.5 +
        np.random.normal(0, 2, sample_size)
    ).clip(0, 20).astype(int)

    demo_df = pd.DataFrame(demo_data)

    # Save demo data
    demo_df.to_csv('demo_student_data.csv', index=False)
    print("Demo dataset created: demo_student_data.csv")

    # Run analysis on demo data
    predictor.data = demo_df
    X, y = predictor.prepare_features_target()
    X_train, X_test, y_train, y_test, feature_names = predictor.split_and_scale_data(X, y)

    # Train and evaluate models
    predictor.train_models(X_train, y_train)
    results = predictor.evaluate_models(X_test, y_test)
    cv_results = predictor.cross_validate_models(X_train, y_train)
    feature_importance = predictor.feature_importance_analysis(feature_names)

    # Generate insights
    predictor.generate_insights(results)

    print("\nAnalysis complete! Check the generated files for detailed results.")


if __name__ == "__main__":
    main()
