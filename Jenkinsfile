pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node18'
    }

    environment {
        SONAR_SCANNER_HOME = tool 'sonar-scanner'
        DOCKERHUB_USER = "bamwood"
        IMAGE_NAME = "calvin-calculator"
    }

    stages {

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh """
                        ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=calvin-calculator \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://13.220.165.56:9000 \
                        -Dsonar.login=${SONAR_AUTH_TOKEN}
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker build -t $DOCKERHUB_USER/$IMAGE_NAME:latest calculator-app
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $DOCKERHUB_USER/$IMAGE_NAME:latest
                    """
                }
            }
        }

        stage('Deploy to App Servers') {
            steps {
                sshagent(['ubuntu']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@3.239.181.137 "
                            docker rm -f calculator-app || true &&
                            docker pull $DOCKERHUB_USER/$IMAGE_NAME:latest &&
                            docker run -d --name calculator-app -p 3000:3000 $DOCKERHUB_USER/$IMAGE_NAME:latest
                        "
                    """
                }
            }
        }
    }
}
