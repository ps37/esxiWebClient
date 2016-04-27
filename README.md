# esxiWebClient
-The Views(HTML) and Controllers(.JS) files are in the '../esxiClient/app/modules' directory and services are in '../esxiClient/app/services' directory.

-Clone the above repo 'esxiWebClient' and go into '../esxiClient/app' directory path and use the following command to start the server.

'NODE_TLS_REJECT_UNAUTHORIZED=0 babel-node startServer.js'

-The app will be available at the url: https://localhost:4443

-Before openening the app in the browser, start a ESXi host to connect to.

-After opening the app in the browser, login by entering the login credentials to connect to the ESXi host.

**Comments on my progress of the project:

--I successfully completed the first 2 parts of the assignment.

-----------------------------------------------------------------------------------------------------------------------------------------
--For the 3rd part, In order to toggle the SSH, after contemplating multiple approaches, I decided to take the following approach:

I decided to toggle the Firewall rule corresponding to SSH. And once I decided on this, I started digging through the 'VMware vSphere Documentation center' and then using the chrome dev tools to explore the 'dist/vSphere.js' library to find the right properties and methods to achieve this.

After struggling with this, I found that, in order to change the fire wall rule set, I have to play with the Data Object "HostFirewallConfigRuleSetConfig = {enabled: boolean, rulesetId: sshServer}" in which I have to toggle the 'enabled' property upon button toggling on the UI.

The hierarchy of the above data object is as follows:
This Data Object is a property of HostFirewallConfig(Data Object) property of--> HostConfigSpec(Data Object) property of--> ApplyHostConfig_Task Method of ----> HostProfileManager(Managed Object) property of --> ServiceContent(Data Object) returned by --> RetrieveServiceContent as vimPort.retrieveServiceContent(serviceInstance) inside the vSphere.js library file.
