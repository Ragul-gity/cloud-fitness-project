pipeline {
  agent any
  environment {
    EC2 = '44.211.25.29'      // replace
    SSH_CRED = 'EC2_SSH_KEY'
    REMOTE_DIR = '/home/ubuntu/fitness/cloudProject_Healthcare/cloud_3'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install & Test') {
      steps {
        // run npm inside an ephemeral node container, mounting workspace
        sh '''
          docker run --rm -v "$PWD":/work -w /work node:18 bash -c "npm install --no-audit --no-fund && npm test || true"
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
}
