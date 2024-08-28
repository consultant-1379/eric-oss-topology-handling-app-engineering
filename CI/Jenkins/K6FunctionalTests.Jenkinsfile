#!/usr/bin/env groovy
package pipeline

pipeline {
    agent {
        label "common_agents"
    }
    options { timestamps () }
    environment {
        BUILD_URL = "${env.JOB_URL}${env.BUILD_ID}/"
        TESTWARE_CLI_IMAGE="armdocker.rnd.ericsson.se/proj-eric-oss-dev-test/k6-reporting-tool-cli:latest"
    }
    stages {
        stage('Prepare') {
            steps {
                cleanWs()
                sh "pip install kubernetes"
                sh "helm repo update"
            }
        }

        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions:[[$class: 'CleanBeforeCheckout']], userRemoteConfigs: [[credentialsId: 'eoadm100-user-creds', url: 'https://gerrit.ericsson.se/OSS/com.ericsson.oss.appEngineering/eric-oss-topology-handling-app-engineering']]])
                sh "chmod +x -R ${env.WORKSPACE}"
            }
        }

        stage('K6 Testing') {
            steps {
                script {
                   withCredentials( [file(credentialsId: env.KUBECONFIG, variable: 'KUBECONFIG')]) {
                       sh "install -m 600 ${KUBECONFIG} ./kubeconfig.conf"
                       sh "python3 -u ./deployment/scripts/restartCount.py ./kubeconfig.conf ${env.NAMESPACE} \"restarts_before_test.txt\""
                       sh "./deployment/scripts/deployK6Pod.sh ./kubeconfig.conf ${env.NAMESPACE} ${env.BUILD_URL}"
                    }
                }
            }
        }

        stage("Get pod logs") {
            steps{
                script {
                    withCredentials( [file(credentialsId: env.KUBECONFIG, variable: 'KUBECONFIG')]) {
                        sh "install -m 600 ${KUBECONFIG} ./kubeconfig.conf"
                        sh "sleep 90"
                        sh "./deployment/scripts/makePodLogs.sh ${env.KUBECONFIG} ${env.NAMESPACE}"
                    }
                }
            }
        }

        stage('Copy Report') {
            steps {
                script {
                    withCredentials( [file(credentialsId: env.KUBECONFIG, variable: 'KUBECONFIG')]) {
                        sh "install -m 600 ${KUBECONFIG} ./kubeconfig.conf"
                        sh "./deployment/scripts/copyK6Report.sh ./kubeconfig.conf ${env.NAMESPACE} ."
                    }
                }
            }
        }
        stage('TH Verify Results') {
            steps {
                sh "python3 -u ./deployment/scripts/verifyResults.py \"summary.json\""
            }
        }
        stage('TH Verify Restarts') {
            steps {
                sh "python3 -u ./deployment/scripts/restartCount.py ./kubeconfig.conf ${env.NAMESPACE} \"restarts_after_test.txt\""
                sh "python3 -u ./deployment/scripts/verifyRestarts.py \"restarts_before_test.txt\" \"restarts_after_test.txt\""
            }
        }

    }

    post {
        always {
            archiveArtifacts 'kubeconfig.conf'
            archiveArtifacts 'summary.json'
            archiveArtifacts 'TopologyHandling_HtmlReport.html'
            archiveArtifacts 'topology-handling-k6-testsuite.log'
            script {
                try {
                    sh label: 'Make snapshot of logs from tempFolder to tempFolder2', returnStatus: true, script: 'cp -r tempFolder/ tempFolder2/'
                    sh label: 'Make snapshot of logs from tempFolder2 to all_logs.zip', returnStatus: true, script: 'zip -r all_logs.zip tempFolder2/'
                    archiveArtifacts 'all_logs.zip'
                } catch (Exception e) {
                    currentBuild.result = 'FAILURE'
                    echo "There is an error during this step: ${e.getMessage()}"
                }
            }
            script {
                // Reads the URLs from the secret created in the target namespace
                RPT_API_URL = sh(script: "kubectl get secrets/testware-resources-secret --template={{.data.api_url}} -n ${NAMESPACE} | base64 -d",
                    returnStdout: true)
                RPT_GUI_URL = sh(script: "kubectl get secrets/testware-resources-secret --template={{.data.gui_url}} -n ${NAMESPACE} | base64 -d",
                    returnStdout: true)
                def testVersion = sh(script: "cat gradle.properties | grep '^version=' | cut -d= -f2 | sed 's/-SNAPSHOT//'", returnStdout: true).trim()
                def passed = isTestPassed()
                sh """
                  echo 'status=${passed}' > artifact.properties
                  echo 'jobDetailsUrl=${BUILD_URL}' >> artifact.properties
                  echo 'testVersion=${testVersion}' >> artifact.properties
                """
            }
            archiveArtifacts 'artifact.properties'
            script {
                sh "./deployment/scripts/cleanupK6run.sh ./kubeconfig.conf ${env.NAMESPACE}"
            }
        }
    }
}

// isTestPassed returns boolean true if the test execution was successful, and returns false if it was not.
def isTestPassed() {
    TESTWARE_CLI_CMD = "docker run --rm -t --pull always -e RPT_API_URL=${RPT_API_URL} " +
                        "-e RPT_GUI_URL=${RPT_GUI_URL} -v ${WORKSPACE}:${WORKSPACE} "+
                        "--user `id -u`:`id -g` ${TESTWARE_CLI_IMAGE} testware-cli"
    return sh(script: "${TESTWARE_CLI_CMD} get-status --development -u ${env.BUILD_URL} --path ${WORKSPACE} | grep 'passed:' | grep -o True || true", returnStdout: true).trim() == "True"
}
