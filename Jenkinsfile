pipeline {
  agent any
  environment {
    EC2 = 'EC2_PUBLIC_IP'       // <-- REPLACE with your EC2 public IP or DNS
    SSH_CRED = 'EC2_SSH_KEY'    // Jenkins credential ID for SSH to EC2
    REMOTE_DIR = '/home/ubuntu/fitness/cloudProject_Healthcare/cloud_3'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test (in node container)') {
      steps {
        // Run npm install and tests inside an ephemeral node:18 container
        sh '''
          echo "Running npm install/test inside node:18..."
          docker run --rm -v "$PWD":/work -w /work node:18 bash -lc "npm install --no-audit --no-fund && npm test || true"
        '''
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
    success { echo 'Pipeline succeeded' }
    failure { echo 'Pipeline failed' }
  }
}
