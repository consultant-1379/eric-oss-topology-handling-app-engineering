FROM armdocker.rnd.ericsson.se/proj-eric-oss-drop/k6/tooling/k6-build-base-image:latest
# Image details: https://hub.docker.com/r/loadimpact/k6/tags

ARG version

ENV TEST_VERSION=$version

ENV STAGING_TYPE="APPLICATION"
ENV K6_TIMESCALEDB_PUSH_INTERVAL="5s"

ENV APP_NAME="eric-oss-topology-handling"
ENV ADDITIONAL_ARGS="--insecure-skip-tls-verify --quiet"


COPY js/ /tests
ADD resources/ /resources