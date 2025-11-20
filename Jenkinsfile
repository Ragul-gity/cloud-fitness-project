pipeline {
  agent any
  environment {
    EC2 = 'YOUR_EC2_PUBLIC_IP'   // <<< Replace with your EC2 IP
    SSH_CRED = 'EC2_SSH_KEY'     // Credential ID from Jenkins
    REMOTE_DIR = '/home/ubuntu/fitness/cloudProject_Healthcare/cloud_3'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test') {
      steps {
        sh 'npm install'
        sh 'npm test || true'
      }
    }

    stage('Deploy to EC2') {
      steps {
        sshagent([SSH_CRED]) {
          sh "ssh -o StrictHostKeyChecking=no ubuntu@${EC2} 'cd ${REMOTE_DIR} && ./deploy.sh'"
        }
      }
    }
  }

  post {
    success {
      echo "Deployment Successful!"
    }
    failure {
      echo "Deployment Failed!"
    }
  }
}
