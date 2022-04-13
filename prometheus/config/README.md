# Before deploying prometheus

1. Generate Username-Password auth file using ```htpasswd -c auth <USER>```  
**!! Keep the file name as ```auth```!!**
2. Create a Kubernetes secret named "prom-auth-admin":
```shell
$ kubectl create secret generic prom-auth-admin --from-file=auth -n <NAMESPACE>
```
3. Check the secret:
```shell
$ kubectl get secret -n prometheus prom-auth-admin -o yaml
```
It needs to have the key ```auth``` in the data field.