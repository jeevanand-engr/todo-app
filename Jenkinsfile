pipeline {
    agent any

    environment {
        APP_NAME    = "devops-todo-app"
        ECR_REPO    = "your-account-id.dkr.ecr.us-east-1.amazonaws.com/devops-todo-app"
        IMAGE_TAG   = "${BUILD_NUMBER}"
        GITHUB_REPO = "https://github.com/your-github-username/devops-todo-app.git"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    junit 'coverage/junit.xml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${APP_NAME}:${IMAGE_TAG} .'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region us-east-1 \
                    | docker login --username AWS --password-stdin ${ECR_REPO}
                    
                    docker tag ${APP_NAME}:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}
                    docker tag ${APP_NAME}:${IMAGE_TAG} ${ECR_REPO}:latest
                    
                    docker push ${ECR_REPO}:${IMAGE_TAG}
                    docker push ${ECR_REPO}:latest
                '''
            }
        }

        stage('Update K8s Manifest') {
            steps {
                sh '''
                    sed -i "s|image:.*|image: ${ECR_REPO}:${IMAGE_TAG}|g" k8s/deployment.yaml
                    
                    git config user.email "jenkins@devops-todo-app.com"
                    git config user.name "Jenkins"
                    git add k8s/deployment.yaml
                    git commit -m "ci: update image tag to ${IMAGE_TAG}"
                    git push origin main
                '''
            }
        }

    }

    post {
        success {
            echo "Pipeline SUCCESS — image ${IMAGE_TAG} deployed"
        }
        failure {
            echo "Pipeline FAILED — check logs above"
        }
    }
}