NAME ?= demo

.PHONY: clean macosx-add-certificate kubernetes-create-secret

# signed certificate
$(NAME).crt: $(NAME).v3.ext $(NAME).csr $(NAME).key ca/$(NAME).key ca/$(NAME).crt
	openssl x509 -req -in $(NAME).csr -CA ca/$(NAME).crt -CAkey ca/$(NAME).key -CAcreateserial -out $(NAME).crt -days 730 -sha256 -extfile $(NAME).v3.ext

# ca private key
ca/$(NAME).key:
	mkdir -p ca
	(cd ca; openssl genrsa -out $(NAME).key 4096)

# ca certificate
ca/$(NAME).crt: ca/$(NAME).key
	(cd ca; openssl req -x509 -new -nodes -key $(NAME).key -sha256 -days 1826 -out $(NAME).crt -subj '/CN=Harp Demo Root CA/C=FR/ST=Paris/L=Paris/O=Harp Demo')

# private key and certificate signing request
$(NAME).csr $(NAME).key:
	openssl req -new -nodes -out $(NAME).csr -newkey rsa:4096 -keyout $(NAME).key -subj '/CN=Harp Demo/C=FR/ST=Paris/L=Paris/O=Harp Demo'

macosx-add-certificate: ca/$(NAME).crt
	sudo security add-trusted-cert -d -r trustRoot -k "/Library/Keychains/System.keychain" ca/$(NAME).crt

kubernetes-create-secret: $(NAME).key $(NAME).crt
	kubectl create secret -n demo tls $(NAME)-tls --key $(NAME).key --cert $(NAME).crt

clean:
	rm *.crt *.csr *.key
	rm ca/*.crt ca/*.key ca/*.srl
