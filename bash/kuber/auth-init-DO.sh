
#Can be used in docker container like:
#FROM ubuntu:18.04
#
#WORKDIR /root
#
#RUN apt-get update && apt-get install -y wget curl && wget https://github.com/digitalocean/doctl/releases/download/v1.39.0/doctl-1.39.0-linux-amd64.tar.gz && tar xf ~/doctl-1.39.0-linux-amd64.tar.gz && mv ~/doctl /usr/local/bin && curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x ./kubectl && mv ./kubectl /usr/local/bin/kubectl
#
## https://github.com/nodesource/distributions#installation-instructions-1
#RUN curl -sL https://deb.nodesource.com/setup_13.x | bash - && apt-get install -y nodejs
#
#WORKDIR /home/node/app
#
#COPY . .
#
## http://bigdatums.net/2017/11/07/how-to-keep-docker-containers-running/
##CMD tail -f /dev/null
#
## CMD [ "/bin/bash", "cron.sh" ]

if [ "${PROTECTED_KUB_CLUSTER}" = "" ]; then

    echo "${0} error: environment variable missing 'PROTECTED_KUB_CLUSTER'";

    exit 1;
fi

if [ "${PROTECTED_DIGITAL_OCEAN_ACCESS_TOKEN}" = "" ]; then

    echo "${0} error: environment variable missing 'PROTECTED_DIGITAL_OCEAN_ACCESS_TOKEN'";

    exit 1;
fi

NUM="10"

_GOOD="0"

for i in $(seq 1 1 ${NUM})
do

  echo -e "\nattempt ${i}:"

  set -x
  doctl auth init --access-token ${PROTECTED_DIGITAL_OCEAN_ACCESS_TOKEN}

  if [ "${?}" = "0" ]; then

      doctl kubernetes cluster kubeconfig save ${PROTECTED_KUB_CLUSTER}

      if [ "${?}" = "0" ]; then

        kubectl get no

        if [ "${?}" = "0" ]; then

            echo "token validated..."

            _GOOD="1"
            break;
        fi
      fi
  fi

  set +x

  sleep 3;
done

if [ "${_GOOD}" = "0" ]; then

    echo "${0} error: couldn't establish reliable connection";

    exit 1;
fi