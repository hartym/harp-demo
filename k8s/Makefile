.PHONY: up down config static reload namespace certs template nginx-ingree-controller

KUBE_CONTEXT ?= docker-desktop
KUBE_NAMESPACE ?= demo
KUBECTL ?= $(shell which kubectl || echo kubectl) --context=$(KUBE_CONTEXT)

CHART ?= oci://europe-west1-docker.pkg.dev/makersquad/harp/harp-proxy
IMAGE ?= makersquad/harp-proxy
TAG ?= 0.7.4
PULL_POLICY ?= IfNotPresent

up: config namespace certs nginx-ingress-controller
	$(MAKE) static

	for f in manifests/*.yaml; do \
	  $(KUBECTL) apply -f $$f; \
	done

	helm upgrade --install --kube-context $(KUBE_CONTEXT) --namespace $(KUBE_NAMESPACE) harp \
	    $(CHART) \
	    -f values/harp.yaml \
	    --set image.repository=$(IMAGE),image.tag=$(TAG),image.pullPolicy=$(PULL_POLICY)

	helm upgrade --install --kube-context $(KUBE_CONTEXT) --namespace $(KUBE_NAMESPACE) prometheus \
	    prometheus-community/prometheus \
	    -f values/prometheus.yaml

	helm upgrade --install --kube-context $(KUBE_CONTEXT) --namespace $(KUBE_NAMESPACE) grafana \
		grafana/grafana \
	    -f values/grafana.yaml

	helm upgrade --install --kube-context $(KUBE_CONTEXT) --namespace $(KUBE_NAMESPACE) locust \
		deliveryhero/locust \
	    -f values/locust.yaml

	$(MAKE) reload

nginx-ingress-controller:
	helm upgrade --install ingress-nginx ingress-nginx \
	  --repo https://kubernetes.github.io/ingress-nginx \
	  --namespace ingress-nginx --create-namespace

template:
	helm template --kube-context $(KUBE_CONTEXT) --namespace $(KUBE_NAMESPACE) harp \
	    $(CHART) \
	    -f values/harp.yaml \
	    --set image.repository=$(IMAGE),image.tag=$(TAG),image.pullPolicy=$(PULL_POLICY) --debug

down:
	$(KUBECTL) delete namespace demo

config:
	helm repo add deliveryhero https://charts.deliveryhero.io/
	helm repo add grafana https://grafana.github.io/helm-charts
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo update

static:
	-$(KUBECTL) delete configmap grafana-dashboards index locustfile locustlib
	$(KUBECTL) create configmap grafana-dashboards --from-file=../grafana/dashboards
	$(KUBECTL) create configmap index --from-file=static/index
	$(KUBECTL) create configmap locustfile --from-file=static/locust/main.py
	$(KUBECTL) create configmap locustlib --from-file=static/locust/lib

reload:
	$(KUBECTL) rollout restart deployment index harp

namespace:
	-$(KUBECTL) create namespace $(KUBE_NAMESPACE)
	kubectx $(KUBE_CONTEXT)
	kubens $(KUBE_NAMESPACE)

certs:
	-(cd certs; $(MAKE) kubernetes-create-secret)


static/index/arch.svg: schema.dot
	dot -Tsvg schema.dot > $@
