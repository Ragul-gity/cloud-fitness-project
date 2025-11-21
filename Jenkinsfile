pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Jenkins automatically checks out the code from your repository
                echo 'Code checked out successfully.'
            }
        }
        
        stage('Deploy Application') {
            steps {
                echo "--- Starting Deployment Script ---"
                
                // Execute the deployment script that was checked out from Git.
                // The script contains the logic to:
                // 1. cd to /home/ubuntu/fitness/cloudProject_Healthcare/cloud_3
                // 2. git pull
                // 3. npm install
                // 4. pm2 restart
                sh './deploy.sh'
                
                echo "--- Deployment triggered via PM2. Check site! ---"
            }
        }
    }
    
    post {
        always {
            // Displays the PM2 status in the Jenkins log for verification
            sh 'pm2 list'
            echo 'Pipeline job finished.'
        }
        failure {
            echo 'Deployment Failed! Check logs for errors.'
        }
    }
}
