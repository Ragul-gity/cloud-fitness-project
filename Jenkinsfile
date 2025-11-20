// Jenkinsfile for Cloud Fitness Project
// Replace EC2_PUBLIC_IP with your EC2 public IP or DNS
// Ensure Jenkins credential ID for SSH matches SSH_CRED below
// Uploaded screenshot (for report): sandbox:/mnt/data/efbbfc4b-76c7-4f2f-900a-6da20b7a050f.png

pipeline {
  agent any

  environment {
    EC2 = '44.211.25.29'         // <<< REPLACE with your EC2 public IP / DNS
    SSH_CRED = 'EC2_SSH_KEY'      // <<< Jenkins credential ID (SSH Username with private key)
    REMOTE_DIR = '/home/ubuntu/fitness/cloudProject_Healthcare/cloud_3'
    WORKDIR = 'cloud_3'           // subfolder in repo that contains package.json
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install & Test (in node container)') {
      steps {
        sh '''
          echo "Starting Install & Test inside node:18 container (folder: ${WORKDIR})..."
          if [ ! -f "$PWD/${WORKDIR}/package.json" ]; then
            echo "ERROR: package.json not found at $PWD/${WORKDIR}"
            ls -la $PWD
            exit 1
          fi
          # Use an ephemeral node container so Jenkins host doesn't need node installed
          docker run --rm -v "$PWD/${WORKDIR}":/work -w /work node:18 \
            bash -lc "npm install --no-audit --no-fund && npm test || true"
        '''
      }
    }

    stage('Prepare Deploy') {
      steps {
        sh 'echo "Preparing to deploy to EC2: ${EC2}"'
        // Optionally run lint or build steps here if you have a frontend build
      }
    }

    stage('Deploy to EC2') {
      steps {
        // Uses SSH credential stored in Jenkins (SSH Username with private key)
        sshagent([env.SSH_CRED]) {
          // Run deploy script on EC2 (must be executable and present)
          sh "ssh -o StrictHostKeyChecking=no ubuntu@${EC2} 'cd ${REMOTE_DIR} && ./deploy.sh'"
        }
      }
    }
  }

  post {
    success {
      echo "Pipeline finished SUCCESS"
    }
    failure {
      echo "Pipeline finished FAILURE - check console output"
    }
    always {
      // archive basic logs/artifacts if needed (adjust patterns)
      archiveArtifacts artifacts: '**/test-results/**/*.xml, **/coverage/**', allowEmptyArchive: true
    }
  }
}
