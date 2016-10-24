#create namespace
kubectl create -f kube-heapster/kube-heapster.yaml

#create RCs and services
kubectl create -f heapster-controller.yaml
kubectl create -f heapster-service.yaml
kubectl create -f grafana-controller.yaml
kubectl create -f grafana-service.yaml
kubectl create -f influxdb-controller.yaml
kubectl create -f influxdb-service.yaml

#generate keys and save in /mnt/grafana
openssl genrsa -out grafana.key 2048
openssl req -new -key grafana.key -out grafana.csr
openssl x509 -req -days 365 -in grafana.csr -signkey grafana.key -out grafana.crt
