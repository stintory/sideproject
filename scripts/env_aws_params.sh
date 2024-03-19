#!/bin/bash
set -x

if [ -f /etc/profile.d/setenv_params.sh ]; then
  rm /etc/profile.d/setenv_params.sh
fi

# get the environment tag value of this EC2 instance
TAG_NAME="Environment"
INSTANCE_ID=$(wget -qO- http://instance-data/latest/meta-data/instance-id)
REGION=$(wget -qO- http://instance-data/latest/meta-data/placement/availability-zone | sed 's/[a-z]$//')
ENVIRONMENT=$(aws ec2 describe-tags \
  --filters "Name=resource-id,Values=$INSTANCE_ID" "Name=key,Values=$TAG_NAME" \
  --region "$REGION" --output=text | cut -f5)

# get all SSM parameter names under the given path
SSM_PARAMETER_NAMES=$(aws ssm get-parameters-by-path \
  --region "$REGION" \
  --path "/Letsee/Backend/$ENVIRONMENT" \
  --recursive \
  --query 'Parameters[].Name' \
  --output text)

touch /etc/profile.d/setenv_params.sh
echo '#!/bin/bash' >> /etc/profile.d/setenv_params.sh

# loop through each parameter and export it as an environment variable
for name in $SSM_PARAMETER_NAMES; do
  value=$(aws ssm get-parameter \
    --region "$REGION" \
    --name "$name" \
    --with-decryption \
    --query 'Parameter.Value' \
    --output text)
  if [ -n "$name" ] && [ -n "$value" ]; then
    name=$(echo "$name" | awk -F/ '{print toupper($NF)}')
    echo "export $name=\"$value\"" >> /etc/profile.d/setenv_params.sh
  fi
done
