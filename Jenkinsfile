pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "bamwood"
        IMAGE_NAME = "calvin-calculator"
    }

    tools {
        nodejs "node18"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/carl300/calvin-calculator.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=calvin-calculator \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t $DOCKERHUB_USER/$IMAGE_NAME:latest calculator-app
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker push $DOCKERHUB_USER/$IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to App Servers') {
            steps {
                sshagent(['app-server-ssh']) {
                    sh '''
                        # Deploy to Server 1
                        ssh -o StrictHostKeyChecking=no ubuntu@3.239.181.137 "
                            docker rm -f calculator-app || true &&
                            docker pull $DOCKERHUB_USER/$IMAGE_NAME:latest &&
                            docker run -d --name calculator-app -p 3000:3000 $DOCKERHUB_USER/$IMAGE_NAME:latest
                        "

                        # Deploy to Server 2
                        ssh -o StrictHostKeyChecking=no ubuntu@44.214.142.123 "
                            docker rm -f calculator-app || true &&
                            docker pull $DOCKERHUB_USER/$IMAGE_NAME:latest &&
                            docker run -d --name calculator-app -p 3000:3000 $DOCKERHUB_USER/$IMAGE_NAME:latest
                        "
                    '''
                }
            }
        }
    }
}
