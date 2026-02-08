This repository contains a Node.js  calculator application deployed through a production‑style CI/CD pipeline.
The pipeline is powered by Jenkins and integrates multiple DevOps tools to ensure code quality, security, and reliable deployments.

The pipeline performs:

Automated Git checkout

Static code analysis with SonarQube

Docker image build

Push to Docker Hub

Remote deployment to AWS EC2

Container restart with zero manual intervention

Monitoring via Prometheus & Grafana


🔄 CI/CD Pipeline Workflow
1. Source Code Checkout
Jenkins pulls the latest code from GitHub:

2. SonarQube Code Analysis
Static analysis checks for:

Bugs

Vulnerabilities

Code smells

Duplications

3. Docker Image Build
Jenkins builds a Docker image using the project’s Dockerfile:


4. Push to Docker Hub
The image is pushed to a public/private Docker Hub repository.

5. Deployment to AWS EC2
Jenkins connects to the EC2 instance via SSH and:

Pulls the latest image

Stops the old container

Runs the new version

6. Monitoring


Project Structure
Code
calvin-calculator/
│
├── Dockerfile
├── Jenkinsfile
├── package.json
├── server.js
├── public/
└── calculator-app/
Prometheus scrapes /metrics and Grafana visualizes application performance.
