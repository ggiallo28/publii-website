REGION=eu-west-1
PREFIXNAME=publii
TEMP_BUCKET=giallo-deployment


install:
	pip3 install -r src/requirements.txt -t src/libs


# make deploy ENV=stage
# make deploy ENV=production
deploy:
	aws cloudformation package --template-file template.yaml \
		--s3-bucket $(TEMP_BUCKET) \
		--output-template-file output-template.yaml && \
	aws cloudformation deploy --stack-name $(ENV)-$(PREFIXNAME)-site-hosting \
		--template-file output-template.yaml --region $(REGION) \
		--parameter-overrides `jq -r '.[] | [.ParameterKey, .ParameterValue] | join("=")' envs/parameters-$(ENV).json | tr '\r\n' ' '` \
		--capabilities CAPABILITY_NAMED_IAM && \
	rm -f output-template.yaml

