{{/*
Expand the name of the chart.
*/}}
{{- define "k6-quick-start-test.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "k6-quick-start-test.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "k6-quick-start-test.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
{{/*
Common labels
*/}}
{{- define "k6-quick-start-test.labels" -}}
helm.sh/chart: {{ include "k6-quick-start-test.chart" . }}
{{ include "k6-quick-start-test.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
{{/*
Selector labels
*/}}
{{- define "k6-quick-start-test.selectorLabels" -}}
app.kubernetes.io/name: {{ include "k6-quick-start-test.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
{{/*
Create the name of the service account to use
*/}}
{{- define "k6-quick-start-test.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "k6-quick-start-test.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "get-application-version" -}}
  {{- $configMapObj := (lookup "v1" "ConfigMap" .Release.Namespace "eric-installed-applications") }}
  {{- $configData := (get $configMapObj.data "Installed") | fromYaml }}
  {{- range $configData.csar }}
    {{- if eq .name "eric-topology-handling" }}
        {{ .version }}
    {{ end}}
  {{- end}}
{{- end}}

{{- define "get-product-version" -}}
  {{- $configMapObj := (lookup "v1" "ConfigMap" .Release.Namespace "eric-installed-applications") }}
  {{- $configData := (get $configMapObj.data "Installed") | fromYaml }}
  {{ $configData.helmfile.release }}
{{- end}}