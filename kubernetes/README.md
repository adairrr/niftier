# Kubernetes

This application is monitored through the Ambassador Edge Stack

1. Apply the prometheus proxy defaults
    ```
    kubectl apply -f ./admin/consul/prom-proxy-defaults.yaml
    ```


1. Install prometheus 
    ```
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm install -f ./admin/helm_configs/prometheus-config.yaml  prometheus prometheus-community/prometheus --wait
    ```

1. Install Grafana
    ```
    helm repo add grafana https://grafana.github.io/helm-charts
    helm install -f ./admin/helm_configs/grafana-config.yaml grafana grafana/grafana --wait
    ```

1. Access the grafana dashboard via port forward
    ```
    export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=grafana" -o jsonpath="{.items[0].metadata.name}") && \
    kubectl --namespace default port-forward $POD_NAME 3000
    ```

## Consul Steps

1. Secure Consul and Registered Services using [this guide](https://learn.hashicorp.com/tutorials/consul/kubernetes-secure-agents)
    Note that you must have [consul installed](https://www.consul.io/docs/install#precompiled-binaries)!
    ```
    kubectl create secret generic consul-gossip-encryption-key --from-literal=key=$(consul keygen)
    ```


1. [Install Consul](https://www.consul.io/docs/k8s/installation/install) and [enable Connect](https://www.consul.io/docs/k8s/service-sync) # TODO ENABLE TLS
    ```
    helm repo add hashicorp https://helm.releases.hashicorp.com
    helm install consul hashicorp/consul -f ./admin/helm_configs/consul-config.yaml --set global.name=consul
    ```


1. Disable kube-dns and enable CoreDNS via 
    [CoreDNS repo](https://github.com/coredns/deployment/tree/master/kubernetes)
    OR: [this stackoverflow solution](https://stackoverflow.com/questions/55122234/installing-coredns-on-gke)
    
    ```
    git clone https://github.com/coredns/deployment.git
    cd deployment/kubernetes
    ./deploy.sh > coredns-deployment.yaml
    ```
    Edit the file to include cluster ip (`kubectl get svc consul-dns -o jsonpath='{.spec.clusterIP}'`) in Corefile after .::53 {...}
    ```
    .::53 {...} # AFTER THIS BLOCK
    consul {
        errors
        cache 30
        forward . CLUSTER_IP_HERE!!!!!!!!
    }
    ```
    ```
    kubectl apply -f ./admin/consul/coredns-deployment.yaml
    kubectl delete --namespace=kube-system deployment kube-dns
    # EXTRA FROM https://stackoverflow.com/questions/55122234/installing-coredns-on-gke
    kubectl scale --replicas=0 deployment/kube-dns-autoscaler --namespace=kube-system && \
    kubectl scale --replicas=0 deployment/kube-dns --namespace=kube-system
    ```
    
    Then do the steps [here](https://www.consul.io/docs/k8s/dns#coredns-configuration) to check that it was configured properly

1. Port forward 8501
    ```
    kubectl port-forward consul-server-0 8501:8501
    ```

1. Get and save the ca-certificate 
    ```
    kubectl get secret consul-ca-cert -o jsonpath="{.data['tls\.crt']}" | base64 --decode > secrets/consul-agent-ca.pem

    kubectl get secret consul-ca-key -o jsonpath="{.data['tls\.key']}" | base64 --decode > secrets/consul-agent-ca-key.pem
    ```

    and verify TLS connections to prove TLs is being enforced
    ```
    consul members -ca-file secrets/consul-agent-ca.pem -http-addr=https://127.0.0.1:8501
    ```

1. Add the HTTP token to an env variable 
    ```
    export CONSUL_HTTP_TOKEN=$(kubectl get secrets/consul-bootstrap-acl-token --template={{.data.token}} | base64 -d)
    ```
    and check that the debug works with the token 
    ```
    consul debug -ca-file secrets/consul-agent-ca.pem -http-addr=https://127.0.0.1:8501
    ```

## Ambassador Steps

1. Create a RoleBinding for cluster admin rights (GKE)
    ```
    kubectl create clusterrolebinding my-cluster-admin-binding \
        --clusterrole=cluster-admin \
        --user=$(gcloud info --format="value(config.account)")
    ```

1. Install the [Ambassador Edge Stack](https://www.getambassador.io/docs/edge-stack/latest/tutorials/getting-started/#1-installation)
    ```
    kubectl apply -f ./admin/ambassador/aes-crds.yaml && \
    kubectl wait --for condition=established --timeout=90s crd -lproduct=aes && \
    kubectl apply -f ./admin/ambassador/aes.yaml && \
    kubectl wait --for condition=available --timeout=90s deploy -lproduct=aes
    ```


1. Connect cluster to Ambassador cloud using [this guide](https://www.getambassador.io/docs/edge-stack/latest/tutorials/getting-started/#3-connect-your-cluster-to-ambassador-cloud)
    ```
    kubectl create configmap --namespace ambassador ambassador-agent-cloud-token --from-literal=CLOUD_CONNECT_TOKEN=PUT_THE_TOKEN_HERE
    ```

1. Using [Ambassador's Consul Integration Docs](https://www.getambassador.io/docs/edge-stack/latest/howtos/consul/), create the ConsulResolver
    ```
    kubectl apply -f ./admin/consul/consul-dc1-resolver.yaml
    ```

1. Deploy the Ambassador Edge Stack Consul Connector 
    ```
    kubectl apply -f ./admin/ambassador/ambassador-consul-connector.yaml
    ```

    Make sure you check the logs. If there is an error with Service Account Permissions, things probably rolled out in the wrong order. Try restarting the connector with:
    ```
    kubectl rollout restart deployment ambassador-consul-connect-integration
    ```

## Testing stuff works!
    Ambassador dashboard:
    ```
    https://${AMBASSADOR_ENDPOINT}/edge_stack/admin/#dashboard
    ```
    ```
    kubectl apply -f ./testing
    ```
    Check that the ambasssador-qotm intention was creating by going to the consul ui
    ```
    https://${CONSUL_UI_ENDPOINT}/ui/dc1/intentions
    ```
    And that the qotm service is actually working 
    ```
    https://${AMBASSADOR_ENDPOINT}/qotm-consul-tls/
    ````

## TLS Steps (Possibly not necessary..... dunno)
[Reference Guide](https://learn.hashicorp.com/tutorials/consul/tls-encryption-secure)
1. Create a certificate signing request with the private key
    ```
    openssl req -new -newkey rsa:2048 -nodes -keyout ./secrets/server1.dc1.consul.key -out ./secrets/server1.dc1.consul.csr -subj '/CN=server.dc1.consul'
    ```

1. Sign the CSR
    ```
    openssl x509 -req -in ./secrets/server1.dc1.consul.csr -CA ./secrets/consul-agent-ca.pem -CAkey ./secrets/consul-agent-ca-key.pem -CAcreateserial -out ./secrets/server1.dc1.consul.crt
    ```

1. Verify the information in the cert is correct
    ```
    openssl x509 -text -noout -in ./secrets/server1.dc1.consul.crt
    ```

1. Enable end-to-end TLS
    create the ambassador-certs secret
    ```
    kubectl create secret tls ambassador-certs --cert=./secrets/consul-agent-ca.pem --key=./secrets/consul-agent-ca-key.pem
    ```
    apply the new service configuration
    ```
    kubectl apply -f ./admin/ambassador/ambassador-service-tls.yaml
    ```

1. Copy the Consul ACL Bootstrap token to ambassador
    ```
    kubectl get secret consul-bootstrap-acl-token --export -o yaml |\
     kubectl apply -f -
    ```

1. Setup TLS Termination to enable HTTPS
    https://www.getambassador.io/docs/edge-stack/latest/howtos/tls-termination/

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
