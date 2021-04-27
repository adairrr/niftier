# Kubernetes

This application is monitored through the Ambassador Edge Stack


## Steps 

1. [Install Consul](https://www.consul.io/docs/k8s/installation/install) and [enable Connect](https://www.consul.io/docs/k8s/service-sync) # TODO ENABLE TLS
    ```
    helm repo add hashicorp https://helm.releases.hashicorp.com
    helm install consul hashicorp/consul -f config.yaml --set global.name=consul
    ```


1. Disable kube-dns and enable CoreDNS
    [CoreDNS repo](https://github.com/coredns/deployment/tree/master/kubernetes)
    OR: [this stackoverflow solution](https://stackoverflow.com/questions/55122234/installing-coredns-on-gke)
    
    ```
    git clone https://github.com/coredns/deployment.git
    cd deployment/kubernetes
    ./deploy.sh > corendns-deployment.yaml
    kubectl apply -f coredns-deployment.yaml
    kubectl delete --namespace=kube-system deployment kube-dns
    # EXTRA FROM https://stackoverflow.com/questions/55122234/installing-coredns-on-gke
    kubectl scale --replicas=0 deployment/kube-dns-autoscaler --namespace=kube-system
    kubectl scale --replicas=0 deployment/kube-dns --namespace=kube-system
    ```
    
    Then do the steps [here](https://www.consul.io/docs/k8s/dns#coredns-configuration)


1. Create a RoleBinding for cluster admin rights (GKE)
    ```
    kubectl create clusterrolebinding my-cluster-admin-binding \
        --clusterrole=cluster-admin \
        --user=$(gcloud info --format="value(config.account)")
    ```

1. Install the [Ambassador Edge Stack](https://www.getambassador.io/docs/edge-stack/latest/tutorials/getting-started/#1-installation)
    ```
    kubectl apply -f ./ambassador/aes-crds.yaml && \
    kubectl wait --for condition=established --timeout=90s crd -lproduct=aes && \
    kubectl apply -f ./ambassador/aes.yaml && \
    kubectl -n ambassador wait --for condition=available --timeout=90s deploy -lproduct=aes
    ```


1. Connect cluster to Ambassador cloud using [this guide](https://www.getambassador.io/docs/edge-stack/latest/tutorials/getting-started/#3-connect-your-cluster-to-ambassador-cloud)
    ```
    kubectl create configmap --namespace ambassador ambassador-agent-cloud-token --from-literal=CLOUD_CONNECT_TOKEN=PUT_THE_TOKEN_HERE
    ```

1. Using [Ambassador's Consul Integration Docs](https://www.getambassador.io/docs/edge-stack/latest/howtos/consul/), create the ConsulResolver
    ```
    kubectl apply -f ./consul/resolvers/consul-dc1.yaml
    ```

1. Deploy the Ambassador Edge Stack Consul Connector 
    ```
    kubectl apply -f ./ambassador/ambassador-consul-connector.yaml
    ```


1. Create the Config Maps 
    ```
    kubectl apply -f configmaps
    ```

1. Create the Persistent Volume Claims
    ```
    kubectl apply -f pvcs 
    ``` 

1. Create the deployments and pods
    ```
    kubectl apply -f deployments && \
    kubectl apply -f pods
    ```

1. Create the services
    ```
    kubectl apply -f services
    ```

1. Create the mappings for the Edge Stack to route traffic to the respective services
    ```
    kubectl apply -f mappings
    ```
