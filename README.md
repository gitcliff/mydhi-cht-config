# mydhi-cht-config

CHT configuration project for Jamaica mHealth

## Overview

This is a repository for the Jamaica mHealth CHT application project. To learn more about CHT check out this [resource](https://docs.communityhealthtoolkit.org/why-the-cht/).

## Set-up

To run the jamaica mHealth CHT application you need to have CHT running locally you need to have the 
[required resources available](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#required-resources) on your machine.

Install the Core Framework by checking out to the cloned [cht-core respository](https://github.com/medic/cht-core) to your local machine and then open your terminal and navigate to the cht-core directory, where you should see the docker-compose.yml file,run the `docker-compose up`. Once the command is done running, navigate to `https://localhost` with the Google Chrome browser and login with the default username medic and default password password. You will get an error “Your connection is not private” (see screenshot). Click “Advanced” and then click “Proceed to localhost”. More information on this [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#1-install-the-core-framework)

Install cht-conf as guided [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#2-install-cht-conf)

Optional: Install Valid TLS Certificate.
To install a valid certificate, open a terminal in the cht-core directory. Ensure the medic-os container is running and make this call: `./scripts/add-local-ip-certs-to-docker.sh`
More details on this [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#5-optional-install-valid-tls-certificate)

More information about CHT Local Environment Setup [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/)

## Loading the jamaica mHealth clinical app forms in CHT

After following the steps above, you now have a running CHT instance on which to deploy the application.To deploy and load jamaica mHealth clinical app forms on the running CHT instance clone [mydhi-cht-config app](https://github.com/I-TECH-UW/mydhi-cht-config) run `cht --url=https://<username>:<password>@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- <app-form-name>` if a valid TLS certiifate was not used and `cht --url=https://<username>:<password>@<domain-name> convert-app-forms upload-app-forms -- <app-form-name>`
if valid TLS certiifate was used eg `cht --url=https://<username>:<password>@192-168-5-70.my.local-ip.co convert-app-forms upload-app-forms -- <app-form-name>`.

`Note:Be sure to replace the values "username" and "password" with the actual username and password of your test instance.`
