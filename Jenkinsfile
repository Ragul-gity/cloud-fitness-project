pipeline {
  agent any
  environment {
    EC2 = 'EC2_PUBLIC_IP'   // replace with your EC2 IP
    SSH_CRED = 'EC2_SSH_KEY'
    REMOTE_DIR = '/home/ubuntu/fitness/cloudProject_Healthcare/cloud_3'
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install & Test') {
      agent { docker { image 'node:18' } }   // << run this stage inside node container
      steps {
        sh 'node -v && npm -v'
        sh 'npm install --no-audit --no-fund'
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
}
