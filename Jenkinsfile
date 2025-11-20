pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Jenkins automatically checks out the code from your Git repo
                echo 'Code checked out successfully.'
            }
        }
        stage('Build and Deploy') {
            steps {
                sh '''
                echo "Starting deployment script..."
                # Navigate to the workspace where Jenkins checked out the code
                cd /var/lib/jenkins/workspace/fitness-app-pipeline/
                
                # Execute the existing deployment script
                /home/ubuntu/fitness/cloudProject_Healthcare/cloud_3/deploy.sh
                '''
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
