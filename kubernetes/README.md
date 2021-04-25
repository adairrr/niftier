# Kubernetes

This application is monitored through the Ambassador Edge Stack

## Steps 
1. Install the Edge Stack
    ```
    kubectl apply -f ambassador/aes.crds.yaml && \
    kubectl wait --for condition=established --timeout=90s crd -lproduct=aes && \
    kubectl apply -f ambassador/aes.yaml && \
    kubectl -n ambassador wait --for condition=available --timeout=90s deploy -lproduct=aes
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
