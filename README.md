# mydhi-cht-config

CHT configuration project for Jamaica mHealth

## Overview

This is a repository for the Jamaica mHealth CHT application project. To learn more about CHT check out this [resource](https://docs.communityhealthtoolkit.org/why-the-cht/).

## Set-up

- To run the jamaica mHealth CHT application you need to have CHT running locally you need to have the 
[required resources available](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#required-resources) on your machine.

- Install the Core Framework by checking out to the cloned [cht-core respository](https://github.com/medic/cht-core) to your local machine and then open your terminal and navigate to the cht-core directory, where you should see the docker-compose.yml file,run the `docker-compose up`. Once the command is done running, navigate to `https://localhost` with the Google Chrome browser and login with the default username medic and default password password. You will get an error “Your connection is not private” (see screenshot). Click “Advanced” and then click “Proceed to localhost”. More information on this [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#1-install-the-core-framework)

- Install cht-conf as guided [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#2-install-cht-conf)

- **Optional**: Install Valid TLS Certificate.
To install a valid certificate, open a terminal in the cht-core directory. Ensure the medic-os container is running and make this call: 
```
$./scripts/add-local-ip-certs-to-docker.sh
```

More details on this [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#5-optional-install-valid-tls-certificate)

More information about CHT Local Environment Setup [here](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/)

## Loading the jamaica mHealth clinical app forms in CHT

After following the steps above, you now have a running CHT instance on which to deploy the application.To deploy and load jamaica mHealth clinical app forms on the running CHT instance clone [mydhi-cht-config app](https://github.com/I-TECH-UW/mydhi-cht-config),navigate to the config folder and run 

```
$ cht --url=https://<username>:<password>@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- <app-form-name>
```
if a valid TLS certiifate was not used..

Use 
```
$ cht --url=https://<username>:<password>@<domain-name> convert-app-forms upload-app-forms -- <app-form-name>
```
if valid TLS certiifate was used eg 
```
cht --url=https://<username>:<password>@192-168-5-70.my.local-ip.co convert-app-forms upload-app-forms -- <app-form-name>
```
**The current clinical app forms include:**
- Level of care Assessment form with an `app-form-name` of `care`  forexample 
 ```
 cht --url=https://<username>:<password>@192-168-5-70.my.local-ip.co convert-app-forms upload-app-forms --  care
 ```
- Treatment Readiness Assessment form with an `app-form-name` of `treatment`  forexample
 ```
 cht --url=https://<username>:<password>@192-168-5-70.my.local-ip.co convert-app-forms upload-app-forms -- treatment
 ```
- SRQ form with an `app-form-name` of `srq`  forexample
 ```
 cht --url=https://<username>:<password>@192-168-5-70.my.local-ip.co convert-app-forms upload-app-forms -- srq
 ```

`Note 1:Be sure to replace the value "app-form-name" with the name of the clinical form you are uploading in CHT forexample "care" for Level of care Assessment form, "treatment" for Treatment Readiness Assessment form and "srq" for SRQ form`

`Note 2:Also be sure to replace the values "username" and "password" with the actual username and password of your test instance.`

## Loading user roles and permissions 
Each user is assigned one of the defined roles which can be defined using the App Management app, which is represented by the roles object of the `app-settings.json` file

Permissions are defined by the permissions object in the `app_settings.json` or `base_settings.json` file. Permissions can also be configured using the App Management app and permission is defined as an array of user role identifiers that have the permission granted.

- When new roles titles are added in the app via the app_settings.json file with their respective tranlations in the the properties files use the format messages-{language-code}.properties run

 ``` 
  $cht --url=https://<username>:<password>@domain upload-custom-translation
 ```
after navigating in the config folder. 

- Then run 

 ``` 
  $cht --url=https://<username>:<password>@domain upload-app-settings
 ```
  to up-load the new roles and permission in your `app_settings.json` file

  You can read more about the roles and permissions in CHT [here](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/user-roles/) and [here](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/user-permissions/) respectively 